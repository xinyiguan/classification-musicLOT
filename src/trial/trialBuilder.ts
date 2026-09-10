import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import type { TrialStimulus } from "../utils/stimuli";

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

const CARD_STYLE = "width: 100%; max-width: 900px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 30px auto 16px auto; padding: 32px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;";
const PLAY_BTN_STYLE = "background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #1e293b; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.95rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;";
const OPTION_CONTAINER_STYLE = "display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0; background: #ffffff; transition: all 0.25s ease;";

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

export function buildTrial(jsPsych: any, stimulus: TrialStimulus) {
  const { trial_id, trainAudio, testAudio, correct_index, tier, foil_type } = stimulus;

  let userResponse: number | null = null;
  let userConfidence: number | null = null;
  const audioPlaybackOrder: string[] = [];
  const audioPlaybackCounts: Record<string, number> = {};

  const INLINE_PLAY_SCRIPT = (id: string) => `
    (function() {
      const allAudios = Array.from(document.querySelectorAll('audio'));
      const isAnyPlaying = allAudios.some(a => !a.paused && !a.ended && a.readyState > 2);
      if (isAnyPlaying) return;

      const target = document.getElementById('${id}');
      if (target) {
        target.play();
      }
    })();
  `;

  const trainingItemsHtml = trainAudio
    .map(
      (src, idx) => `
      <div style="margin-bottom: 10px;">
        <audio class="trial-audio" id="train-audio-${idx}" src="${src}" preload="auto"></audio>
        <button type="button" class="audio-play-btn" style="${PLAY_BTN_STYLE}" onclick="${INLINE_PLAY_SCRIPT(`train-audio-${idx}`)}">
          <span>▶ Sample ${idx + 1}</span>
        </button>
      </div>`
    )
    .join("");

  const testItemsHtml = testAudio
    .map(
      (src, idx) => `
      <label id="option-container-${idx}" class="option-container" style="${OPTION_CONTAINER_STYLE} cursor: pointer;">
        <input 
          type="radio" 
          id="option-${idx}" 
          name="test-choice" 
          value="${idx}" 
          style="width: 18px; height: 18px; cursor: pointer; accent-color: #2563eb;"
        />
        <div style="flex-grow: 1;">
          <audio class="trial-audio test-audio" id="test-audio-${idx}" data-test-idx="${idx}" src="${src}" preload="auto"></audio>
          <button type="button" class="audio-play-btn" style="${PLAY_BTN_STYLE}" onclick="${INLINE_PLAY_SCRIPT(`test-audio-${idx}`)}">
            <span>▶ Option ${String.fromCharCode(65 + idx)}</span>
          </button>
        </div>
      </label>`
    )
    .join("");

  const stimulusHtml = `
    <div style="${CARD_STYLE}">
      <div style="${BADGE_HEADER_STYLE}">Classification Task</div>
      <p style="font-size: 1.05rem; color: #2d3643; margin: 0 0 20px 0; font-weight: 500;">
        Play and listen to the samples in the training group column on the left. 
        Then listen to all options on the right, select your choice, rate your confidence, and click Submit.
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="border-right: 2px solid #cbd5e1; padding-right: 20px;">
          <h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 0; margin-bottom: 14px;">
            Training Group (${trainAudio.length} Samples)
          </h3>
          ${trainingItemsHtml}
        </div>
        <div>
          <h3 style="font-size: 0.9rem; letter-spacing: 0.05em; color: #64748b; margin-top: 0; margin-bottom: 14px;">
            Which one belongs to the group?
          </h3>
          ${testItemsHtml}
        </div>
      </div>

      <div id="confidence-box" style="margin: 24px auto 0 auto; padding: 20px 10px 5px 10px; border-top: 2px dashed ${COLORS.cardBorder}; text-align: center; max-width: 480px;">
          <div style="font-weight: bold; color: ${COLORS.textPrimary}; margin-bottom: 14px; font-size: 1em;">How confident are you in your choice?</div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px;">
              ${[1, 2, 3, 4, 5].map((n) => `
                  <label id="conf-label-${n}" class="confidence-label-node">
                      <input class="confidence-input" type="radio" name="confidence-rating" value="${n}" />
                      <span style="font-weight: bold; font-size: 1.1em; color: ${COLORS.textTertiary};">${n}</span>
                      ${n === 1 ? `<span style="font-size: 0.7em; color: ${COLORS.textMutedLight}; position: absolute; bottom: -18px; white-space: nowrap;">low</span>` : ``}
                      ${n === 5 ? `<span style="font-size: 0.7em; color: ${COLORS.textMutedLight}; position: absolute; bottom: -18px; white-space: nowrap;">high</span>` : ``}
                  </label>
              `).join("")}
          </div>
      </div>

      <div id="feedback-message" style="margin-top: 18px; font-weight: bold; font-size: 1.15em; text-align: center; min-height: 1.4em;"></div>
    </div>
  `;

  return [
    {
      type: jsPsychHtmlButtonResponse,
      stimulus: stimulusHtml,
      choices: ["Submit Choice"],
      data: {
        task: "classification",
        trial_id: trial_id,
        tier: tier,
        foil_type: foil_type,
        correct_response: correct_index,
      },
      on_load: () => {
        injectStyles();

        if (!experimentProgressVisible) {
          document.body.classList.remove("experiment-progress-hidden");
          document.body.classList.add("experiment-progress-visible");
          experimentProgressVisible = true;
        }

        const playButtons = document.querySelectorAll<HTMLButtonElement>(".audio-play-btn");
        const audioElements = document.querySelectorAll<HTMLAudioElement>(".trial-audio");
        const testAudioElements = document.querySelectorAll<HTMLAudioElement>(".test-audio");
        const submitBtn = document.querySelector<HTMLButtonElement>(
          '#jspsych-html-button-response-btngroup button[data-choice="0"]'
        );
        const radios = document.querySelectorAll<HTMLInputElement>('input[name="test-choice"]');
        const confidenceInputs = document.querySelectorAll<HTMLInputElement>('input[name="confidence-rating"]');

        const listenedTestOptions = new Set<number>();
        let isSubmitted = false;

        if (submitBtn) {
          submitBtn.disabled = true;
        }

        const checkCanSubmit = () => {
          if (isSubmitted) return;
          const radioSelected = document.querySelector<HTMLInputElement>('input[name="test-choice"]:checked') !== null;
          const confidenceSelected = document.querySelector<HTMLInputElement>('input[name="confidence-rating"]:checked') !== null;
          const allTestAudioHeard = listenedTestOptions.size === testAudio.length;

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

        const updateButtonStates = (disabled: boolean) => {
          if (isSubmitted) return;
          playButtons.forEach((btn) => {
            btn.disabled = disabled;
            btn.style.opacity = disabled ? "0.4" : "1";
            btn.style.cursor = disabled ? "not-allowed" : "pointer";
            btn.style.pointerEvents = disabled ? "none" : "auto";
          });
        };

        playButtons.forEach((btn) => {
          btn.addEventListener("mouseover", () => {
            if (!btn.disabled && !isSubmitted) btn.style.backgroundColor = "#cbd5e1";
          });
          btn.addEventListener("mouseout", () => {
            if (!btn.disabled && !isSubmitted) btn.style.backgroundColor = "#f1f5f9";
          });
        });

        testAudioElements.forEach((audio) => {
          const markListened = () => {
            const idxStr = audio.getAttribute("data-test-idx");
            if (idxStr !== null) {
              listenedTestOptions.add(parseInt(idxStr, 10));
              checkCanSubmit();
            }
          };

          audio.addEventListener("ended", markListened);
        });

        audioElements.forEach((audio) => {
          audio.addEventListener("play", () => {
            updateButtonStates(true);
            const audioId = audio.id;
            audioPlaybackOrder.push(audioId);
            audioPlaybackCounts[audioId] = (audioPlaybackCounts[audioId] || 0) + 1;
          });
          audio.addEventListener("ended", () => updateButtonStates(false));
          audio.addEventListener("pause", () => updateButtonStates(false));
          audio.addEventListener("error", () => updateButtonStates(false));
        });

        if (submitBtn) {
          submitBtn.addEventListener("click", (e) => {
            if (isSubmitted) return;
            
            e.preventDefault();
            e.stopPropagation();

            isSubmitted = true;

            const selectedRadio = document.querySelector<HTMLInputElement>('input[name="test-choice"]:checked');
            const selectedConfidence = document.querySelector<HTMLInputElement>('input[name="confidence-rating"]:checked');

            userResponse = selectedRadio ? parseInt(selectedRadio.value, 10) : null;
            userConfidence = selectedConfidence ? parseInt(selectedConfidence.value, 10) : null;

            submitBtn.disabled = true;
            radios.forEach((r) => (r.disabled = true));
            confidenceInputs.forEach((c) => (c.disabled = true));
            updateButtonStates(true);

            audioElements.forEach((a) => a.pause());

            // Visual feedback handling
            const isCorrect = userResponse === correct_index;

            if (userResponse !== null) {
              const selectedContainer = document.getElementById(`option-container-${userResponse}`);
              if (selectedContainer) {
                selectedContainer.classList.add(isCorrect ? "choice-correct" : "choice-incorrect");
              }
            }

            if (!isCorrect && correct_index !== null && correct_index >= 0) {
              const correctContainer = document.getElementById(`option-container-${correct_index}`);
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
        data.response = userResponse;
        data.confidence = userConfidence;
        data.audio_playback_order = audioPlaybackOrder;
        data.audio_playback_counts = audioPlaybackCounts;

        if (jsPsych && typeof jsPsych.setProgressBar === "function") {
          const currentProgress = jsPsych.getProgress();
          if (currentProgress && typeof currentProgress.current_trial_global !== "undefined") {
            const progressFraction = currentProgress.current_trial_global / currentProgress.total_trials;
            jsPsych.setProgressBar(progressFraction);
          }
        }
      },
    },
  ];
}