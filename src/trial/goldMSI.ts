import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import * as goldUtils from "../utils/goldMSIQuestions";

const BYPASS_ANSWER_CHECK = false; // temporarily set to true to bypass required answer validation for faster testing

const goldMSIResponseLabels = [
    "completely disagree",
    "strongly disagree",
    "disagree",
    "neither agree nor disagree",
    "agree",
    "strongly agree",
    "completely agree",
];

interface GoldMSIConfig {
    questionKeys?: string[]; // Optional array of master keys to filter specific questions
}

// Reusable structural style matching headphoneCheck.ts for strict layout parity
const CARD_STYLE = "min-width: 600px; max-width: 600px; width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 60px auto; padding: 35px; box-sizing: border-box; text-align: left;";

export function buildGoldMSITimeline(config?: GoldMSIConfig) {
    // 1. Fetch data structures safely from goldUtils
    const masterQuestions = (goldUtils as any).GOLD_MSI_MASTER_QUESTIONS as Record<string, any> ?? {};

    // 2. Determine which keys to display (use provided list or fallback to all master keys)
    const targetKeys = config?.questionKeys ?? Object.keys(masterQuestions);

    if (targetKeys.length === 0) {
        console.error("Gold-MSI Error: No questions found to display!");
        return [];
    }

    // 3. Separate questions dynamically by their functional rendering types
    const sliderQuestions: any[] = [];
    const mcQuestions: any[] = [];
    const textQuestions: any[] = [];

    targetKeys.forEach((key) => {
        const q = masterQuestions[key];
        if (!q) return;

        if (q.type === "string") {
            textQuestions.push(q);
        } else if (q.choices && q.choices.length > 0) {
            mcQuestions.push(q);
        } else {
            sliderQuestions.push(q);
        }
    });

    const timeline: any[] = [];

    // Track total items for progress badge parity
    const totalQuestions = sliderQuestions.length + mcQuestions.length + textQuestions.length;
    let globalIndex = 1;

    // Injection helper to cleanly stylize active dynamic pseudo-states without bloating external stylesheets
    const injectInteractiveStyles = () => {
        if (document.getElementById("gold-msi-inline-styles")) return;
        const styleEl = document.createElement("style");
        styleEl.id = "gold-msi-inline-styles";
        styleEl.innerHTML = `
      .gold-msi-radio-label {
        display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; gap: 8px; cursor: pointer; padding: 12px 8px; border: 1px solid #cbd5e1; border-radius: 6px; background-color: #f8fafc; transition: all 0.2s ease-in-out; flex: 1 1 0px; min-width: 0;
      }
      .gold-msi-radio-label:hover { background-color: #f1f5f9; border-color: #94a3b8; }
      .gold-msi-radio-label.selected { background-color: #ebf5fa; border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }
      .gold-msi-text-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }
    `;
        document.head.appendChild(styleEl);
    };

    // Small helper to style continue button blue
    const styleContinueButtonBlue = (btn: HTMLButtonElement | null) => {
        if (!btn) return;
        btn.style.backgroundColor = "#3b82f6";
        btn.style.color = "#ffffff";
        btn.style.border = "1px solid #2563eb";
        btn.style.padding = "10px 24px";
        btn.style.borderRadius = "6px";
        btn.style.fontWeight = "600";
        btn.style.transition = "background-color 0.2s ease";
        btn.style.cursor = "pointer";

        btn.addEventListener("mouseover", () => {
            if (!btn.disabled) btn.style.backgroundColor = "#2563eb";
        });
        btn.addEventListener("mouseout", () => {
            if (!btn.disabled) btn.style.backgroundColor = "#3b82f6";
        });
    };

    // Shared helper: show success message and ENABLE button 
    const enableNextButton = (continueBtn: HTMLButtonElement | null, feedbackContainer: HTMLElement | null, message: string) => {
        if (feedbackContainer) {
            feedbackContainer.innerHTML = `<span style="color: #059669; font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">✓ ${message} (Press Spacebar or click Next)</span>`;
        }
        if (continueBtn) {
            continueBtn.disabled = false;
        }
    };

    // ==========================================
    // TYPE 1: INDIVIDUAL SLIDER QUESTIONS
    // ==========================================
    sliderQuestions.forEach((question) => {
        const currentIndex = globalIndex++;
        let currentSelection: number | null = null;
        let hasInteracted = false;
        let spaceHandler: ((e: KeyboardEvent) => void) | null = null;

        const sliderTrial = {
            type: jsPsychHtmlButtonResponse,
            data: {
                task: "gold_msi",
                subtask: "gold_msi_slider_item",
                questionId: question.id
            },
            stimulus: () => `
        <div style="${CARD_STYLE}">
          <div style="margin-bottom: 25px;">
            <span style="background-color: #e2e8f0; color: #1e293b; padding: 6px 14px; border-radius: 20px; font-weight: bold; border: 1px solid #cbd5e1; font-size: 0.95em;">
              Question <span style="color: #059669; font-size: 1.1em;">${currentIndex}</span> of ${totalQuestions}
            </span>
          </div>
          
          <div data-question-id="${question.id}" style="margin-bottom: 20px;">
            <p style="font-weight: 600; color: #1e293b; font-size: 1.2em; margin: 0 0 25px 0; line-height: 1.5;">${question.prompt}</p>
            
            <div style="display: flex; justify-content: space-between; font-size: 0.85em; color: #64748b; margin-bottom: 8px; font-weight: 500;">
              <span>1 (strongly disagree)</span>
              <span>7 (strongly agree)</span>
            </div>
            <div style="width: 100%;">
              <input
                class="gold-msi-slider"
                type="range"
                min="1"
                max="7"
                step="1"
                value="4"
                aria-label="${question.prompt}"
                style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 4px; cursor: pointer;"
              />
            </div>
            <div class="gold-msi-current-value" style="margin-top: 15px; font-size: 0.95em; min-height: 22px;" aria-live="polite">
              Value: <span style="color: #475569;">Not set</span>
            </div>
          </div>
          <div class="gold-msi-feedback" style="margin-top: 15px; min-height: 24px; font-size: 0.95em;"></div>
        </div>
      `,
            choices: ["Next"],
            on_load: () => {
                const slider = document.querySelector<HTMLInputElement>(".gold-msi-slider");
                const valueSpan = document.querySelector<HTMLElement>(".gold-msi-current-value span");
                const feedbackContainer = document.querySelector<HTMLElement>(".gold-msi-feedback");
                const continueBtn = document.querySelector<HTMLButtonElement>(".jspsych-btn");

                styleContinueButtonBlue(continueBtn);
                if (continueBtn) continueBtn.disabled = !BYPASS_ANSWER_CHECK;

                // Spacebar support
                spaceHandler = (e: KeyboardEvent) => {
                    if (e.code === "Space") {
                        e.preventDefault();
                        if (continueBtn && !continueBtn.disabled) continueBtn.click();
                    }
                };
                window.addEventListener("keydown", spaceHandler);

                // Registers slider changes and handles static clicks at position 4
                const registerInteraction = () => {
                    if (!slider) return;
                    currentSelection = slider.valueAsNumber;

                    if (valueSpan) {
                        const label = goldMSIResponseLabels[currentSelection - 1] ?? "";
                        valueSpan.style.color = "#2f5bea";
                        valueSpan.style.fontWeight = "bold";
                        valueSpan.textContent = `${currentSelection} (${label})`;
                    }

                    if (!hasInteracted) {
                        hasInteracted = true;
                        enableNextButton(continueBtn, feedbackContainer, "Selection Saved!");
                    }
                };

                if (slider) {
                    slider.addEventListener("input", registerInteraction);
                    slider.addEventListener("change", registerInteraction);
                    slider.addEventListener("pointerdown", registerInteraction);
                    slider.addEventListener("click", registerInteraction);
                }
                window.scrollTo(0, 0);
            },
            on_finish: (data: any) => {
                if (spaceHandler) window.removeEventListener("keydown", spaceHandler);
                data.response = currentSelection ?? 4;
            },
        };
        timeline.push(sliderTrial);
    });

    // ==========================================
    // TYPE 2: INDIVIDUAL MULTIPLE CHOICE QUESTIONS
    // ==========================================
    mcQuestions.forEach((question) => {
        const currentIndex = globalIndex++;
        let currentSelection: string | null = null;
        let hasInteracted = false;
        let spaceHandler: ((e: KeyboardEvent) => void) | null = null;

        const mcTrial = {
            type: jsPsychHtmlButtonResponse,
            data: {
                task: "gold_msi",
                subtask: "gold_msi_mc_item",
                questionId: question.id
            },
            stimulus: () => `
        <div style="${CARD_STYLE}">
          <div style="margin-bottom: 25px;">
            <span style="background-color: #e2e8f0; color: #1e293b; padding: 6px 14px; border-radius: 20px; font-weight: bold; border: 1px solid #cbd5e1; font-size: 0.95em;">
              Question <span style="color: #059669; font-size: 1.1em;">${currentIndex}</span> of ${totalQuestions}
            </span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="font-weight: 600; color: #1e293b; font-size: 1.2em; margin-bottom: 20px; line-height: 1.5;">
              ${question.prompt}
            </p>
            <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: stretch; gap: 10px; margin-top: 15px; width: 100%;">
              ${question.choices.map((label: string) => `
                <label class="gold-msi-radio-label">
                  <input type="radio" name="${question.id}" value="${label}" class="gold-msi-radio" style="margin: 0; cursor: pointer; transform: scale(1.1);" />
                  <span style="font-size: 0.85rem; line-height: 1.3; color: #334155; font-weight: 500; word-break: break-word;">${label}</span>
                </label>
              `).join("")}
            </div>
          </div>
          <div class="gold-msi-feedback" style="margin-top: 15px; min-height: 24px; font-size: 0.95em;"></div>
        </div>
      `,
            choices: ["Next"],
            on_load: () => {
                injectInteractiveStyles();

                const radios = Array.from(document.querySelectorAll<HTMLInputElement>(".gold-msi-radio"));
                const feedbackContainer = document.querySelector<HTMLElement>(".gold-msi-feedback");
                const continueBtn = document.querySelector<HTMLButtonElement>(".jspsych-btn");

                styleContinueButtonBlue(continueBtn);
                if (continueBtn) continueBtn.disabled = !BYPASS_ANSWER_CHECK;

                // Spacebar support
                spaceHandler = (e: KeyboardEvent) => {
                    if (e.code === "Space") {
                        e.preventDefault();
                        if (continueBtn && !continueBtn.disabled) continueBtn.click();
                    }
                };
                window.addEventListener("keydown", spaceHandler);

                radios.forEach((radio) => {
                    radio.addEventListener("change", () => {
                        currentSelection = radio.value;

                        radios.forEach(r => r.parentElement?.classList.remove("selected"));
                        radio.parentElement?.classList.add("selected");

                        if (!hasInteracted) {
                            hasInteracted = true;
                            enableNextButton(continueBtn, feedbackContainer, "Answer Registered!");
                        }
                    });
                });
                window.scrollTo(0, 0);
            },
            on_finish: (data: any) => {
                if (spaceHandler) window.removeEventListener("keydown", spaceHandler);
                data.response = currentSelection;
            },
        };
        timeline.push(mcTrial);
    });

    // ==========================================
    // TYPE 3: INDIVIDUAL TEXT INPUT QUESTIONS
    // ==========================================
    textQuestions.forEach((question) => {
        const currentIndex = globalIndex++;
        let currentSelection = "";
        let spaceHandler: ((e: KeyboardEvent) => void) | null = null;

        const textTrial = {
            type: jsPsychHtmlButtonResponse,
            data: {
                task: "gold_msi",
                subtask: "gold_msi_text_item",
                questionId: question.id
            },
            stimulus: () => `
        <div style="${CARD_STYLE}">
          <div style="margin-bottom: 25px;">
            <span style="background-color: #e2e8f0; color: #1e293b; padding: 6px 14px; border-radius: 20px; font-weight: bold; border: 1px solid #cbd5e1; font-size: 0.95em;">
              Question <span style="color: #059669; font-size: 1.1em;">${currentIndex}</span> of ${totalQuestions}
            </span>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
            <p style="font-weight: 600; color: #1e293b; font-size: 1.2em; margin: 0; line-height: 1.5;">
              ${question.prompt}
            </p>
            <input 
              type="text" 
              id="${question.id}" 
              class="gold-msi-text-input" 
              placeholder="Type your response here..."
              style="width: 100%; padding: 14px; font-size: 1rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; transition: all 0.2s; margin-top: 10px;"
            />
          </div>
          <div class="gold-msi-feedback" style="margin-top: 15px; min-height: 24px; font-size: 0.95em;"></div>
        </div>
      `,
            choices: ["Submit Answer"],
            on_load: () => {
                injectInteractiveStyles();

                const input = document.querySelector<HTMLInputElement>(".gold-msi-text-input");
                const feedbackContainer = document.querySelector<HTMLElement>(".gold-msi-feedback");
                const continueBtn = document.querySelector<HTMLButtonElement>(".jspsych-btn");

                styleContinueButtonBlue(continueBtn);
                if (continueBtn) continueBtn.disabled = !BYPASS_ANSWER_CHECK;

                // Spacebar support — ignore space when typing inside input
                spaceHandler = (e: KeyboardEvent) => {
                    if (e.code === "Space") {
                        if (document.activeElement === input) return;
                        e.preventDefault();
                        if (continueBtn && !continueBtn.disabled) continueBtn.click();
                    }
                };
                window.addEventListener("keydown", spaceHandler);

                if (input) {
                    input.addEventListener("input", () => {
                        currentSelection = input.value;

                        if (currentSelection.trim() !== "") {
                            enableNextButton(continueBtn, feedbackContainer, "Input Logged!");
                        } else {
                            if (feedbackContainer) feedbackContainer.innerHTML = "";
                            if (continueBtn && !BYPASS_ANSWER_CHECK) continueBtn.disabled = true;
                        }
                    });
                }
                window.scrollTo(0, 0);
            },
            on_finish: (data: any) => {
                if (spaceHandler) window.removeEventListener("keydown", spaceHandler);
                data.response = currentSelection;
            },
        };
        timeline.push(textTrial);
    });

    return timeline;
}