import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";

const BYPASS_ANSWER_CHECK = false; // set to true to bypass required answer validation during testing

export interface DemographicAnswers {
  age?: string;
  education?: string;
  sex?: string;
}

interface DemographicQuestion {
  id: keyof DemographicAnswers;
  prompt: string;
  options: string[];
}

const DEMOGRAPHIC_QUESTIONS: DemographicQuestion[] = [
  {
    id: "age",
    prompt: "Age",
    options: [
      "18-25",
      "26-40",
      "41-60",
      "60 or older"
    ]
  },
  {
    id: "education",
    prompt: "Education level",
    options: [
      "Without diploma",
      "Junior High school diploma",
      "High school diploma or equivalent (e.g., Gymnasium)",
      "Bachelor's degree",
      "Master's degree",
      "Doctorate (e.g., PhD, MD, JD)"
    ]
  },
  {
    id: "sex",
    prompt: "Biological sex",
    options: [
      "Female",
      "Male"
    ]
  }
];

// Reusable structural style matching goldMSIQuestions style sheet
const CARD_STYLE =
  "min-width: 600px; max-width: 600px; width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 60px auto; padding: 35px; box-sizing: border-box; text-align: left;";

export function buildDemographicsTimeline() {
  const responses: DemographicAnswers = {};

  // Dynamic CSS injection for consistent input styling
  const injectInteractiveStyles = () => {
    if (document.getElementById("demographics-inline-styles")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "demographics-inline-styles";
    styleEl.innerHTML = `
      .demo-dropdown-select {
        width: 100%;
        padding: 12px 14px;
        font-size: 1rem;
        color: #1e293b;
        background-color: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        box-sizing: border-box;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        appearance: none;
        background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%2364748b" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1-1.506 0z"/></svg>');
        background-repeat: no-repeat;
        background-position: right 14px center;
        background-size: 12px;
      }
      .demo-dropdown-select:hover {
        background-color: #f1f5f9;
        border-color: #94a3b8;
      }
      .demo-dropdown-select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        background-color: #ffffff;
      }
    `;
    document.head.appendChild(styleEl);
  };

  // Helper to style continue button
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

  let spaceHandler: ((e: KeyboardEvent) => void) | null = null;

  const demographicsTrial = {
    type: jsPsychHtmlButtonResponse,
    data: {
      task: "demographics",
      subtask: "demographics_survey",
    },
    stimulus: () => `
      <div style="${CARD_STYLE}">
        <div style="margin-bottom: 25px;">
          <h2 style="margin: 0; font-size: 1.4rem; color: #1e293b; font-weight: 700;">
            Demographic Information
          </h2>
          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.95rem;">
            Please answer all questions below to proceed.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 20px;">
          ${DEMOGRAPHIC_QUESTIONS.map(
            (q) => `
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label for="${q.id}-select" style="font-weight: 600; color: #1e293b; font-size: 1.05rem;">
                ${q.prompt}
              </label>
              <select 
                id="${q.id}-select" 
                data-id="${q.id}"
                class="demo-dropdown-select"
                aria-label="${q.prompt}"
              >
                <option value="" disabled selected>-- Please select an option --</option>
                ${q.options
                  .map((opt) => `<option value="${opt}">${opt}</option>`)
                  .join("")}
              </select>
            </div>
          `
          ).join("")}
        </div>

        <div class="demographics-feedback" style="margin-top: 20px; min-height: 24px; font-size: 0.95em;"></div>
      </div>
    `,
    choices: ["Submit"],
    on_load: () => {
      injectInteractiveStyles();

      const selects = Array.from(
        document.querySelectorAll<HTMLSelectElement>(".demo-dropdown-select")
      );
      const feedbackContainer = document.querySelector<HTMLElement>(
        ".demographics-feedback"
      );
      const continueBtn = document.querySelector<HTMLButtonElement>(
        ".jspsych-btn"
      );

      styleContinueButtonBlue(continueBtn);
      if (continueBtn) continueBtn.disabled = !BYPASS_ANSWER_CHECK;

      // Spacebar submission handler (ignores if focus is on a dropdown)
      spaceHandler = (e: KeyboardEvent) => {
        if (e.code === "Space") {
          if (selects.some((sel) => document.activeElement === sel)) return;
          e.preventDefault();
          if (continueBtn && !continueBtn.disabled) continueBtn.click();
        }
      };
      window.addEventListener("keydown", spaceHandler);

      // Validate all questions are filled out
      const checkAllAnswered = () => {
        const allSelected = selects.every((sel) => sel.value !== "");

        if (allSelected) {
          selects.forEach((sel) => {
            const id = sel.getAttribute("data-id") as keyof DemographicAnswers;
            if (id) responses[id] = sel.value;
          });

          if (feedbackContainer) {
            feedbackContainer.innerHTML = `<span style="color: #059669; font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">✓ All answers complete! (Press Spacebar or click Submit)</span>`;
          }
          if (continueBtn) continueBtn.disabled = false;
        } else {
          if (feedbackContainer) feedbackContainer.innerHTML = "";
          if (continueBtn && !BYPASS_ANSWER_CHECK) continueBtn.disabled = true;
        }
      };

      selects.forEach((select) => {
        select.addEventListener("change", checkAllAnswered);
      });

      window.scrollTo(0, 0);
    },
    on_finish: (data: any) => {
      if (spaceHandler) window.removeEventListener("keydown", spaceHandler);
      data.responses = responses;
    },
  };

  return [demographicsTrial];
}