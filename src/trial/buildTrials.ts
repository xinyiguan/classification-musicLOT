import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import type { TrialStimulus } from "../stimuli";
import type { Phase } from "../main";

// ============================================================================
// COLOR & STYLE CONFIGURATION
// ============================================================================
const COLORS = {
  white: "#ffffff",
  appBackground: "#f4f6fa",
  cardBackground: "#ffffff",
  cardBorder: "#e2e8f0",
  progressContainerBackground: "#f1f5f9",
  progressOuterBackground: "#e2e8f0",
  progressInnerBackground: "#0284c7",
  buttonBackground: "#4f46e5",
  buttonHoverBackground: "#4338ca",
  buttonDisabledBackground: "#cbd5e1",
  buttonDisabledText: "#94a3b8",
  buttonShadow: "rgba(79, 70, 229, 0.15)",
  buttonHoverShadow: "rgba(67, 56, 202, 0.2)",
  confidenceBorder: "#cbd5e1",
  confidenceHoverBackground: "#f1f5f9",
  confidenceHoverBorder: "#94a3b8",
  confidenceSelectedBackground: "#eff6ff",
  confidenceSelectedBorder: "#2f5bea",
  confidenceSelectedText: "#2f5bea",
  optionBackground: "#f8fafc",
  textPrimary: "#1e293b",
  textMutedLight: "#94a3b8",
  textTertiary: "#334155",
  successBackground: "#f0fdf4",
  successBorder: "#16a34a",
  successShadow: "rgba(22, 163, 74, 0.15)",
  successText: "#15803d",
  errorBackground: "#fef2f2",
  errorBorder: "#dc2626",
  errorShadow: "rgba(220, 38, 38, 0.15)",
  errorText: "#b91c1c"
};

const CARD_STYLE = "width: 100%; max-width: 900px; height: 610px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 30px auto 16px auto; padding: 32px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;";
const PLAY_BTN_STYLE = "background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #1e293b; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background-color 0.2s;";
const OPTION_CONTAINER_STYLE = "display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: #ffffff; transition: all 0.25s ease;";
const PRACTICE_BADGE_STYLE = `background-color: #7C3AED; color: #FFFFFF; display: inline-block; padding: 6px 14px; border-radius: 6px; font-size: 0.85em; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);`;

const FEEDBACK_DURATION_MS = 1500;

let experimentProgressVisible = false;

function injectStyles() {
  if (document.getElementById("trial-builder-custom-styles")) return;
  const styleEl = document.createElement("style");
  styleEl.id = "trial-builder-custom-styles";
  styleEl.innerHTML = `
    body,
    .jspsych-display-element,
    #jspsych-content {
        background-color: ${COLORS.appBackground} !important;
    }
    body.in-practice-phase #jspsych-progressbar-container {
        display: none !important;
    }
    #jspsych-progressbar-container {
        background-color: ${COLORS.progressContainerBackground} !important;
        padding: 8px 0 !important;
        border-bottom: 1px solid ${COLORS.cardBorder} !important;
        margin-bottom: 10px !important;
    }
    #jspsych-progressbar-outer {
        background-color: ${COLORS.progressOuterBackground} !important;
        border-radius: 20px !important;
        height: 12px !important;
        max-width: 620px !important;
        margin: 0 auto !important;
    }
    #jspsych-progressbar-inner {
        background-color: ${COLORS.progressInnerBackground} !important;
        background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent) !important;
        background-size: 1rem 1rem !important;
        border-radius: 20px !important;
        transition: width 0.4s ease !important;
    }

    .audio-play-btn.listened {
        background-color: #e2e8f0 !important;
        border-color: #94a3b8 !important;
    }

    .custom-submit-btn, #jspsych-html-button-response-btngroup button.jspsych-btn {
        background-color: ${COLORS.buttonBackground} !important;
        color: ${COLORS.white} !important;
        font-family: sans-serif !important;
        font-size: 0.95em !important;
        font-weight: 600 !important;
        padding: 10px 24px !important;
        border: none !important;
        border-radius: 6px !important;
        box-shadow: 0 2px 4px ${COLORS.buttonShadow} !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
    }
    .custom-submit-btn:hover:not(:disabled), #jspsych-html-button-response-btngroup button.jspsych-btn:hover:not(:disabled) {
        background-color: ${COLORS.buttonHoverBackground} !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 6px ${COLORS.buttonHoverShadow} !important;
    }
    .custom-submit-btn:disabled, #jspsych-html-button-response-btngroup button.jspsych-btn:disabled {
        background-color: ${COLORS.buttonDisabledBackground} !important;
        color: ${COLORS.buttonDisabledText} !important;
        box-shadow: none !important;
        cursor: not-allowed !important;
        transform: none !important;
        opacity: 1 !important;
    }

    /* Feedback visual styles */
    .option-container.choice-correct {
        background-color: ${COLORS.successBackground} !important;
        border: 2px solid ${COLORS.successBorder} !important;
        box-shadow: 0 0 0 3px ${COLORS.successShadow} !important;
    }
    .option-container.choice-incorrect {
        background-color: ${COLORS.errorBackground} !important;
        border: 2px solid ${COLORS.errorBorder} !important;
        box-shadow: 0 0 0 3px ${COLORS.errorShadow} !important;
    }

    /* Confidence Rating Component Styles */
    .confidence-label-node {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        position: relative; cursor: pointer; width: 65px; height: 50px;
        border: 1px solid ${COLORS.confidenceBorder}; border-radius: 8px; background: ${COLORS.optionBackground}; transition: all 0.2s;
    }
    .confidence-label-node:hover { background: ${COLORS.confidenceHoverBackground}; border-color: ${COLORS.confidenceHoverBorder}; }
    .confidence-label-node.selected-active {
        background-color: ${COLORS.confidenceSelectedBackground} !important; border-color: ${COLORS.confidenceSelectedBorder} !important; color: ${COLORS.confidenceSelectedText} !important;
        box-shadow: 0 0 0 2px rgba(47, 91, 234, 0.15);
    }
    .confidence-label-node.selected-active span { color: ${COLORS.confidenceSelectedText} !important; }
    .confidence-input { position: absolute; opacity: 0; width: 0; height: 0; }
  `;
  document.head.appendChild(styleEl);
}

interface classficiationTrialParams{
  trial: TrialStimulus;
  phase: Phase;
  practiceLabel?: string; 
}

// ============================================================================
// CLASSIFICATION TRIAL GENERATOR
// ============================================================================
export function createClassificationTrial(params: classficiationTrialParams) {
  let userResponse: number | null = null;
  let userConfidence: number | null = null;
  const audioPlaybackOrder: string[] = [];
  const audioPlaybackCounts: Record<string, number> = {};

  const trainingItemsHtml = params.trial.train
    .map(
      (src, idx) => `
      <div style="margin-bottom: 12px;">
        <audio class="trial-audio train-audio" id="train-audio-${idx}" data-train-idx="${idx}" src="${src}" preload="auto"></audio>
        <button type="button" class="audio-play-btn train-play-btn" id="train-btn-${idx}" style="${PLAY_BTN_STYLE}">
          <span>▶ Sample ${idx + 1}</span>
        </button>
        <div style="margin-top: 4px; display: flex; align-items: center; gap: 8px;">
          <input type="range" id="train-seek-${idx}" min="0" max="100" value="0" step="0.1" disabled style="width: 100%; cursor: not-allowed; opacity: 0.5;" />
        </div>
      </div>`
    )
    .join("");

  const testItemsHtml = params.trial.test
    .map(
      (src, idx) => `
      <label id="option-container-${idx}" class="option-container" style="${OPTION_CONTAINER_STYLE} cursor: pointer;">
        <input 
          type="radio" 
          id="option-${idx}" 
          name="test-choice" 
          value="${idx}" 
          disabled
          style="width: 18px; height: 18px; cursor: not-allowed; accent-color: #2563eb; margin-top: 6px;"
        />
        <div style="flex-grow: 1;">
          <audio class="trial-audio test-audio" id="test-audio-${idx}" data-test-idx="${idx}" src="${src}" preload="auto"></audio>
          <button type="button" class="audio-play-btn test-play-btn" id="test-btn-${idx}" disabled style="${PLAY_BTN_STYLE} opacity: 0.4; cursor: not-allowed; pointer-events: none;">
            <span>▶ Option ${String.fromCharCode(65 + idx)}</span>
          </button>
          <div style="margin-top: 4px; display: flex; align-items: center; gap: 8px;">
            <input type="range" id="test-seek-${idx}" min="0" max="100" value="0" step="0.1" disabled style="width: 100%; cursor: not-allowed; opacity: 0.5;" />
          </div>
        </div>
      </label>`
    )
    .join("");

  const stimulusHtml = `
    <div style="${CARD_STYLE}">
      <div id="trial-badge-container" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 16px;">
        <div style="${BADGE_HEADER_STYLE} margin-bottom: 0;">
          Classification Task
        </div>
        ${params.practiceLabel ? `
          <div style="${PRACTICE_BADGE_STYLE} margin-bottom: 0;">
            ${params.practiceLabel}
          </div>
        ` : ``}
      </div>

      <p style="font-size: 1.05rem; color: #2d3643; margin: 0 0 20px 0; font-weight: 500;">
        Listen to all <strong>Training Melodies</strong> on the left. 
        Then listen to <strong>both options</strong> on the right, select your answer & rate your confidence, then Submit.
        (Audio slider unlock <strong>after</strong> 1 full listen).
      </p>
      <div style="display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 24px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="border-right: 2px solid #cbd5e1; padding-right: 20px;">
          <h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 0; margin-bottom: 14px;">
            Training Melodies (${params.trial.train.length} Samples)
          </h3>
          ${trainingItemsHtml}
        </div>
        <div>
          <h3 style="font-size: 0.95rem; text-align:center; color: #64748b; margin-top: 0; margin-bottom: 18px;">
            Which one follows the same pattern as the training melodies?
          </h3>
          ${testItemsHtml}
        </div>
      </div>

      <div id="confidence-box" style="margin: 10px auto 0 auto; padding: 15px 10px 5px 10px; text-align: center; max-width: 480px;">
          <div style="font-weight: bold; color: ${COLORS.textPrimary}; margin-bottom: 10px; font-size: 1em;">How confident are you in your choice?</div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px;">
              ${[1, 2, 3, 4, 5].map((n) => `
                  <label id="conf-label-${n}" class="confidence-label-node">
                      <input class="confidence-input" type="radio" name="confidence-rating" value="${n}" />
                      <span style="font-weight: bold; font-size: 1.1em; color: ${COLORS.textTertiary};">${n}</span>
                      ${n === 1 ? `<span style="font-size: 0.8em; color: ${COLORS.textMutedLight}; position: absolute; bottom: -22px; white-space: nowrap;">low</span>` : ``}
                      ${n === 5 ? `<span style="font-size: 0.8em; color: ${COLORS.textMutedLight}; position: absolute; bottom: -22px; white-space: nowrap;">high</span>` : ``}
                  </label>
              `).join("")}
          </div>
      </div>

      <div id="feedback-message" style="margin-top: 14px; font-weight: bold; font-size: 1.15em; text-align: center; min-height: 1.4em;"></div>
    </div>
  `;

  return {
    stimulusHtml,
    getState: () => ({
      userResponse,
      userConfidence,
      audioPlaybackOrder,
      audioPlaybackCounts,
    }),
    setUserResponse: (resp: number | null) => { userResponse = resp; },
    setUserConfidence: (conf: number | null) => { userConfidence = conf; }
  };
}

// ============================================================================
// MAIN TRIAL BUILDER FUNCTION
// ============================================================================
export function buildTrial(jsPsych: any, phase: Phase, trial: TrialStimulus, practiceLabel?: string) {
  const trialComponent = createClassificationTrial({ trial, phase, practiceLabel });
  return {
      type: jsPsychHtmlButtonResponse,
      stimulus: trialComponent.stimulusHtml,
      choices: ["Submit Choice"],
      data: {
        task: "classification",
        trial_id: trial.trial_id,
        correctChoice: trial.correctChoice,
        phase: phase,
        ...(practiceLabel ? { practice_label: practiceLabel } : {})
      },
      on_start: () => {
        if (phase === "practice") {
          document.body.classList.add("in-practice-phase");
        } else {
          document.body.classList.remove("in-practice-phase");
        }
      },
      on_load: () => {
        injectStyles();

        if (!experimentProgressVisible) {
          document.body.classList.remove("experiment-progress-hidden");
          document.body.classList.add("experiment-progress-visible");
          experimentProgressVisible = true;
        }

        const audioElements = document.querySelectorAll<HTMLAudioElement>(".trial-audio");
        const submitBtn = document.querySelector<HTMLButtonElement>(
          '#jspsych-html-button-response-btngroup button[data-choice="0"]'
        );
        const radios = document.querySelectorAll<HTMLInputElement>('input[name="test-choice"]');
        const confidenceInputs = document.querySelectorAll<HTMLInputElement>('input[name="confidence-rating"]');

        const listenedTrainOptions = new Set<number>();
        const listenedTestOptions = new Set<number>();
        let isSubmitted = false;

        if (submitBtn) {
          submitBtn.disabled = true;
        }

        const updateTestAccess = () => {
          if (isSubmitted) return;
          const allTrainHeard = listenedTrainOptions.size === trial.train.length;

          radios.forEach((radio) => {
            radio.disabled = !allTrainHeard;
            const container = radio.closest(".option-container") as HTMLElement;
            if (container) {
              container.style.cursor = allTrainHeard ? "pointer" : "not-allowed";
              container.style.opacity = allTrainHeard ? "1" : "0.7";
            }
          });

          const testButtons = document.querySelectorAll<HTMLButtonElement>(".test-play-btn");
          testButtons.forEach((btn) => {
            btn.disabled = !allTrainHeard;
            btn.style.opacity = allTrainHeard ? "1" : "0.4";
            btn.style.cursor = allTrainHeard ? "pointer" : "not-allowed";
            btn.style.pointerEvents = allTrainHeard ? "auto" : "none";
          });
        };

        const checkCanSubmit = () => {
          if (isSubmitted) return;
          const radioSelected = document.querySelector<HTMLInputElement>('input[name="test-choice"]:checked') !== null;
          const confidenceSelected = document.querySelector<HTMLInputElement>('input[name="confidence-rating"]:checked') !== null;
          const allTestAudioHeard = listenedTestOptions.size === trial.test.length;

          if (submitBtn) {
            submitBtn.disabled = !(radioSelected && confidenceSelected && allTestAudioHeard);
          }
        };

        const updateConfidenceVisuals = (activeValue: number) => {
          [1, 2, 3, 4, 5].forEach((n) => {
            const label = document.getElementById(`conf-label-${n}`);
            if (label) {
              if (n === activeValue) {
                label.classList.add("selected-active");
              } else {
                label.classList.remove("selected-active");
              }
            }
          });
        };

        radios.forEach((radio) => {
          radio.addEventListener("change", checkCanSubmit);
        });

        confidenceInputs.forEach((confInput) => {
          confInput.addEventListener("change", () => {
            const val = parseInt(confInput.value, 10);
            updateConfidenceVisuals(val);
            checkCanSubmit();
          });
        });

        // Initialize state on load
        updateTestAccess();

        // Setup individual audio controls
        audioElements.forEach((audio) => {
          const audioId = audio.id;
          const isTest = audio.classList.contains("test-audio");
          const idxStr = audio.getAttribute(isTest ? "data-test-idx" : "data-train-idx");
          const btn = document.getElementById(isTest ? `test-btn-${idxStr}` : `train-btn-${idxStr}`) as HTMLButtonElement;
          const seek = document.getElementById(isTest ? `test-seek-${idxStr}` : `train-seek-${idxStr}`) as HTMLInputElement;

          const prefix = isTest ? `Option ${String.fromCharCode(65 + Number(idxStr))}` : `Sample ${Number(idxStr) + 1}`;

          const updateBtnDisplay = () => {
            if (audio.paused || audio.ended) {
              btn.innerHTML = `<span>▶ ${prefix}</span>`;
            } else {
              btn.innerHTML = `<span>⏹ Stop ${prefix}</span>`;
            }
          };

          btn.addEventListener("click", () => {
            if (isSubmitted) return;
            
            if (audio.paused) {
              // Pause any other playing audio first
              audioElements.forEach((other) => {
                if (other !== audio) other.pause();
              });
              audio.play().catch(() => {});
            } else {
              // Only allow stopping/pausing if the melody has been listened to completely at least once
              if (btn.classList.contains("listened")) {
                audio.pause();
              }
            }
          });

          audio.addEventListener("timeupdate", () => {
            if (!isNaN(audio.duration) && audio.duration > 0) {
              const percent = (audio.currentTime / audio.duration) * 100;
              seek.value = percent.toString();
            }
          });

          seek.addEventListener("input", () => {
            if (btn.classList.contains("listened") && !isNaN(audio.duration) && audio.duration > 0) {
              const targetTime = (parseFloat(seek.value) / 100) * audio.duration;
              audio.currentTime = targetTime;
            }
          });

          audio.addEventListener("play", () => {
            updateBtnDisplay();
            const state = trialComponent.getState();
            state.audioPlaybackOrder.push(audioId);
            state.audioPlaybackCounts[audioId] = (state.audioPlaybackCounts[audioId] || 0) + 1;
          });

          audio.addEventListener("pause", () => {
            updateBtnDisplay();
          });

          audio.addEventListener("ended", () => {
            updateBtnDisplay();
            seek.value = "0";
            btn.classList.add("listened");

            // Unlock the seekbar permanently after first complete listen
            seek.disabled = false;
            seek.style.cursor = "pointer";
            seek.style.opacity = "1";

            if (isTest && idxStr !== null) {
              listenedTestOptions.add(parseInt(idxStr, 10));
              checkCanSubmit();
            } else if (!isTest && idxStr !== null) {
              listenedTrainOptions.add(parseInt(idxStr, 10));
              updateTestAccess();
            }
          });
        });

        if (submitBtn) {
          submitBtn.addEventListener("click", (e) => {
            if (isSubmitted) return;
            
            e.preventDefault();
            e.stopPropagation();

            isSubmitted = true;

            const selectedRadio = document.querySelector<HTMLInputElement>('input[name="test-choice"]:checked');
            const selectedConfidence = document.querySelector<HTMLInputElement>('input[name="confidence-rating"]:checked');

            trialComponent.setUserResponse(selectedRadio ? parseInt(selectedRadio.value, 10) : null);
            trialComponent.setUserConfidence(selectedConfidence ? parseInt(selectedConfidence.value, 10) : null);

            submitBtn.disabled = true;
            radios.forEach((r) => (r.disabled = true));
            confidenceInputs.forEach((c) => (c.disabled = true));

            audioElements.forEach((a) => {
              a.pause();
            });

            const playButtons = document.querySelectorAll<HTMLButtonElement>(".audio-play-btn");
            playButtons.forEach((b) => (b.disabled = true));

            // Visual feedback handling
            const currentState = trialComponent.getState();
            const isCorrect = currentState.userResponse === trial.correctChoice;

            if (currentState.userResponse !== null) {
              const selectedContainer = document.getElementById(`option-container-${currentState.userResponse}`);
              if (selectedContainer) {
                selectedContainer.classList.add(isCorrect ? "choice-correct" : "choice-incorrect");
              }
            }

            if (!isCorrect && trial.correctChoice !== null && trial.correctChoice >= 0) {
              const correctContainer = document.getElementById(`option-container-${trial.correctChoice}`);
              if (correctContainer) {
                correctContainer.classList.add("choice-correct");
              }
            }

            setTimeout(() => {
              if (jsPsych && typeof jsPsych.finishTrial === "function") {
                jsPsych.finishTrial();
              } else {
                submitBtn.click();
              }
            }, FEEDBACK_DURATION_MS);
          }, true);
        }
      },
      on_finish: (data: Record<string, any>) => {
        const currentState = trialComponent.getState();
        data.trial_id = trial.trial_id;
        data.train = trial.train;
        data.phase = phase;
        data.response = currentState.userResponse;
        data.confidence = currentState.userConfidence;
        data.audio_playback_order = currentState.audioPlaybackOrder;
        data.audio_playback_counts = currentState.audioPlaybackCounts;
        if (practiceLabel) {
          data.practice_label = practiceLabel;
        }

        if (jsPsych && typeof jsPsych.setProgressBar === "function") {
          const currentProgress = jsPsych.getProgress();
          if (currentProgress && typeof currentProgress.current_trial_global !== "undefined") {
            const progressFraction = currentProgress.current_trial_global / currentProgress.total_trials;
            jsPsych.setProgressBar(progressFraction);
          }
        }
        if (phase === "practice") {
          document.body.classList.remove("in-practice-phase");
        }
      },
    }
}