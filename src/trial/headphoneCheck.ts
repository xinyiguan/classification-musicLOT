import { JsPsych } from "jspsych";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import preloadPlugin from "@jspsych/plugin-preload";

const BYPASS_ANSWER_CHECK = false; // Set to true to allow immediate skipping/clicking for faster testing

declare module "jspsych" {
    interface JsPsych {
        endExperiment(message?: string, css_class?: string): void;
    }
}

interface CheckSound {
    answer: number; // 1, 2, or 3 (representing which tone is the quietest)
    file: string;
}

interface HeadphoneCheckSettings {
    volumeSound: string;
    checkExample: string;
    checkSounds: CheckSound[];
    trialCount: number;
    passMark: number;
}

const BASE = import.meta.env.BASE_URL || "/";

const defaultSettings: HeadphoneCheckSettings = {
    volumeSound: `${BASE}hc/Antiphase_calibration.flac`,
    checkExample: `${BASE}hc/Antiphase_HC_ISO.flac`,
    checkSounds: [
        { answer: 3, file: `${BASE}hc/Antiphase_HC_OIS.flac` },
        { answer: 2, file: `${BASE}hc/Antiphase_HC_OSI.flac` },
        { answer: 1, file: `${BASE}hc/Antiphase_HC_SIO.flac` },
        { answer: 1, file: `${BASE}hc/Antiphase_HC_SOI.flac` },
        { answer: 3, file: `${BASE}hc/Antiphase_HC_IOS.flac` },
        { answer: 2, file: `${BASE}hc/Antiphase_HC_ISO.flac` },
    ],
    trialCount: 6,
    passMark: 5,
};

// Reusable structural style to ensure strict width and layout parity
const CARD_STYLE = "width: 100%; max-width: 680px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 60px auto; padding: 35px; box-sizing: border-box;";
const CARD_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 0.85em; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px;"

export function createHeadphoneCheck(jsPsych: JsPsych, customSettings: Partial<HeadphoneCheckSettings> = {}): any[] {
    const settings = { ...defaultSettings, ...customSettings };
    const mainTimeline: any[] = [];

    let attemptCounter = 1;

    // --- AUTOMATED ASSET PRELOADING ---
    const audioFilesToPreload = [
        settings.volumeSound,
        settings.checkExample,
        ...settings.checkSounds.map(sound => sound.file)
    ];

    const preloadTrial = {
        type: preloadPlugin,
        audio: audioFilesToPreload,
        message: "",
        show_progress_bar: false,
        show_detailed_errors: false,
        continue_after_error: false,
        data: { save_trial: false }
    };
    mainTimeline.push(preloadTrial);


    // --- PLAYBACK HELPER WITH BYPASS CHECK ---
    (window as any)._playHCTestFile = (filePath: string, elementId: string) => {
        const audioEl = document.getElementById(elementId) as HTMLAudioElement;
        if (!audioEl) return;

        if (!(audioEl as any)._hasPlayed) {
            audioEl.onended = () => {
                (audioEl as any)._hasPlayed = true;

                // Target our newly unified internal layout class
                document.querySelectorAll(".custom-choice-btn").forEach(btn => {
                    const button = btn as HTMLButtonElement;
                    button.disabled = false;
                    button.style.opacity = "1";
                    button.style.cursor = "pointer";
                });
            };
        }

        audioEl.src = filePath;
        audioEl.play();
    };

    // --- 1a. VOLUME CHECK INTRODUCTION ---
    const volumeIntroTrial = {
        type: htmlButtonResponse,
        stimulus: () => `
        <div style="${CARD_STYLE} text-align: center;">
            <div style="${CARD_HEADER_STYLE}">
                Step 1 of 2
            </div>
            <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 1.4em;">Headphone & Volume Check</h3>
            <p style="color: #475569; font-size: 1.05em; margin-bottom: 20px;">Before we begin the main task, we need to ensure you are wearing headphones and that your system volume is set correctly.</p>
            <p style="color: #64748b; font-size: 0.95em; margin: 0;">On the next screen, an audio track will play automatically. Please ensure your headphones are connected.</p>
        </div>
    `,
        choices: ["Begin adjustment"],
        data: { task: "volume_check_intro" }
    };
        
    mainTimeline.push(volumeIntroTrial);

    // --- 1b. VOLUME CALIBRATION (PLAYBACK) ---
    const volumePlaybackTrial = {
        type: htmlButtonResponse,
        stimulus: () => `
        <div style="${CARD_STYLE} text-align: center;">
            <p style="font-weight: bold; margin-bottom: 1em; color: #1e293b; font-size: 1.25em;">Please put on your headphones.</p>
            <p style="color: #475569; margin-bottom: 25px;">Adjust your system volume so that the calibration sound is at a stable, comfortable level.</p>
            <div style="margin: 20px 0;">
                <audio id="jspsych-audio-stim" src="${settings.volumeSound}" autoplay loop controls controlsList="nodownload" style="width: 100%; max-width: 400px;"></audio>
            </div>
        </div>
    `,
        choices: ["Volume is Adjusted & Ready"],
        data: { task: "volume_check_playback" },
        on_load: function () {
            const audioElement = document.getElementById('jspsych-audio-stim') as HTMLAudioElement;
            if (audioElement) {
                audioElement.volume = 0.4;
            }
        }
    };
    mainTimeline.push(volumePlaybackTrial);

    // --- 2. EXAMPLE & INSTRUCTIONS TRIAL ---
    const exampleTrial = {
        type: htmlButtonResponse,
        stimulus: () => `
            <div style="${CARD_STYLE} text-align: center;">
                <div style="background-color: #ebf5fa; color: #059669; display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 0.85em; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px;">
                    Step 2 of 2
                </div>
                <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 1.4em;">Headphone Screening Test</h3>
                <p style="color: #475569; margin-bottom: 12px;">On the next few screens, you will hear three sequential tones separated by brief silences.</p>
                <p style="color: #475569; margin-bottom: 12px;">One of the three tones will sound noticeably <strong>quieter</strong> than the other two.</p>
                <p style="color: #475569; margin-bottom: 25px;">Your task is to identify which tone was the quietest: <b>1</b>, <b>2</b>, or <b>3</b>.</p>
                
                <div style="margin-top: 20px; border-top: 2px dashed #e2e8f0; padding-top: 20px;">
                    <span style="font-weight: bold; color: #0f172a; font-size: 0.95em; display: block; margin-bottom: 6px;">Practice Example:</span>
                    <p style="color: #64748b; font-size: 0.95em; margin: 0 0 15px 0;">Click below to test. The <strong>second</strong> tone is the quietest, meaning the correct option is <strong>2</strong>.</p>
                    <div style="text-align: center;">
                        <audio id="hc-audio-example" style="display:none;"></audio>
                        <button type="button" class="jspsych-btn" onclick="window._playHCTestFile('${settings.checkExample}', 'hc-audio-example')"
                                style="background-color: #2f5bea; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                            ▶ Play Practice Example
                        </button>
                    </div>
                </div>
            </div>
        `,
        choices: ["I Understand, Start Test"],
        data: { task: "hc_example" },
    };
    mainTimeline.push(exampleTrial);

    // --- 3. REPEATABLE LOOP TIMELINE ---
    const loopTimeline: any[] = [];

    // --- 4. EXECUTE TASK TRIALS ---
    settings.checkSounds.forEach((trial, index) => {
        const uniqueAudioId = `hc-audio-trial-${index}`;
        const taskTrial = {
            type: htmlButtonResponse,
            stimulus: () => `
                <div style="${CARD_STYLE} text-align: center;">
                    <div style="margin-bottom: 25px;">
                        <span style="background-color: #e2e8f0; color: #1e293b; padding: 6px 14px; border-radius: 20px; font-weight: bold; border: 1px solid #cbd5e1; font-size: 0.95em;">
                            Trial <span style="color: #c25208; font-size: 1.5em;">${index + 1}</span> of ${settings.trialCount}
                        </span>
                    </div>
                    
                    <p style="margin-bottom: 20px; color: #475569;">Click the blue button below to play the sound sequence:</p>
                    
                    <div style="margin: 25px 0;">
                        <audio id="${uniqueAudioId}" style="display:none;"></audio>
                        <button type="button" class="jspsych-btn" onclick="window._playHCTestFile('${trial.file}', '${uniqueAudioId}')"
                                style="background-color: #2f5bea; color: white; padding: 12px 24px; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">
                            ▶ Play Audio Sequence
                        </button>
                    </div>
                    
                    <p style="margin-top: 25px; font-weight: bold; color: #1e293b;">Which tone was the quietest?</p>
                    
                    <div id="custom-choices-container" style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                        <button type="button" class="custom-choice-btn jspsych-btn" data-choice="0" style="padding: 10px 25px; font-size: 1.1em; font-weight: bold; min-width: 60px;">1</button>
                        <button type="button" class="custom-choice-btn jspsych-btn" data-choice="1" style="padding: 10px 25px; font-size: 1.1em; font-weight: bold; min-width: 60px;">2</button>
                        <button type="button" class="custom-choice-btn jspsych-btn" data-choice="2" style="padding: 10px 25px; font-size: 1.1em; font-weight: bold; min-width: 60px;">3</button>
                    </div>
                </div>
            `,
            choices: [], // Leaving this empty forces jsPsych to completely skip rendering external buttons
            data: {
                task: "antiphase_headphone_check",
                expectedAnswerIndex: trial.answer - 1,
                attempt: () => attemptCounter
            },
            on_load: () => {
                window.scrollTo(0, 0);

                const choiceButtons = document.querySelectorAll(".custom-choice-btn") as NodeListOf<HTMLButtonElement>;

                // 1. Lock down the internal choices immediately unless bypass is on
                if (!BYPASS_ANSWER_CHECK) {
                    choiceButtons.forEach(btn => {
                        btn.disabled = true;
                        btn.style.opacity = "0.4";
                        btn.style.cursor = "not-allowed";
                    });
                }

                // 2. Intercept clicks to manually advance jsPsych with the logged answer
                choiceButtons.forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        const target = e.currentTarget as HTMLButtonElement;
                        if (target.disabled) return;

                        const selectedResponse = parseInt(target.getAttribute("data-choice") || "0", 10);

                        // Cleanly finish the current trial step and submit the answer index
                        jsPsych.finishTrial({
                            response: selectedResponse
                        });
                    });
                });

            },
            on_finish: (data: any) => {
                document.body.classList.remove("hc-audio-locked");
                data.correct = data.response === data.expectedAnswerIndex;
            },
        };
        loopTimeline.push(taskTrial);
    });

    // --- 5. SCORE EVALUATION & RETRY SCREEN ---
    const screeningEvaluation = {
        type: htmlButtonResponse,
        stimulus: () => {
            const lastAttemptTrials = jsPsych.data.get()
                .filter({ task: "antiphase_headphone_check" })
                .values()
                .slice(-settings.trialCount);

            const correctCount = lastAttemptTrials.filter((t: any) => t.correct).length;

            if (correctCount >= settings.passMark) {
                return `
                    <div style="${CARD_STYLE} text-align: center;">
                        <h3 style="color: #16a34a; margin-top: 0; font-size: 1.4em;">Screening Passed!</h3>
                        <p style="font-size: 1.1em; color: #1e293b;">Your Score: <strong>${correctCount} / ${settings.trialCount}</strong> correct.</p>
                        <p style="color: #475569; margin: 0;">Thank you. Your audio settings meet the experimental requirements.</p>
                    </div>
                `;
            } else if (attemptCounter === 1) {
                return `
                    <div style="${CARD_STYLE} text-align: center;">
                        <h3 style="color: #dc2626; margin-top: 0; font-size: 1.4em;">Screening Failed (Attempt 1 of 2)</h3>
                        <p style="font-size: 1.1em; color: #1e293b;">Your Score: <strong>${correctCount} / ${settings.trialCount}</strong> correct (Required: ${settings.passMark}).</p>
                        <p style="color: #475569; margin-bottom: 15px;">Please double-check that your headphones are plugged in tightly and that you are not playing the audio over your device's external speakers.</p>
                        <p style="color: #64748b; font-size: 0.95em; margin: 0;">You have <strong>one remaining attempt</strong> to pass the check before the experiment closes.</p>
                    </div>
                `;
            } else {
                return `
                    <div style="${CARD_STYLE} text-align: center;">
                        <h3 style="color: #dc2626; margin-top: 0; font-size: 1.4em;">Screening Failed (Attempt 2 of 2)</h3>
                        <p style="font-size: 1.1em; color: #1e293b;">Your Score: <strong>${correctCount} / ${settings.trialCount}</strong> correct (Required: ${settings.passMark}).</p>
                        <p style="color: #475569; margin-bottom: 15px;">This experiment strictly requires the use of headphones to gather valid data.</p>
                        <p style="color: #64748b; font-size: 0.95em; margin: 0;">The experiment will now terminate. Thank you for your time.</p>
                    </div>
                `;
            }
        },
        choices: () => {
            const lastAttemptTrials = jsPsych.data.get()
                .filter({ task: "antiphase_headphone_check" })
                .values()
                .slice(-settings.trialCount);
            const correctCount = lastAttemptTrials.filter((t: any) => t.correct).length;
            if (correctCount >= settings.passMark) { return ["Begin Main Experiment"]; }
            else if (attemptCounter === 1) { return ["Retry Screening Test"]; }
            else { return []; }
        },
        on_finish: () => {
            const lastAttemptTrials = jsPsych.data.get().filter({ task: "antiphase_headphone_check" }).values().slice(-settings.trialCount);
            const correctCount = lastAttemptTrials.filter((t: any) => t.correct).length;
            if (correctCount >= settings.passMark) { return; }
            if (attemptCounter >= 2) {
                jsPsych.endExperiment("Experiment ended early: Failed anti-phase headphone screening twice.");
            } else {
                attemptCounter += 1;
            }
        },
    };
    loopTimeline.push(screeningEvaluation);

    const screeningLoopNode = {
        timeline: loopTimeline,
        loop_function: () => {
            const lastAttemptTrials = jsPsych.data.get().filter({ task: "antiphase_headphone_check" }).values().slice(-settings.trialCount);
            const correctCount = lastAttemptTrials.filter((t: any) => t.correct).length;
            if (correctCount >= settings.passMark) { return false; }
            return attemptCounter === 2;
        }
    };

    mainTimeline.push(screeningLoopNode);

    return mainTimeline;
}