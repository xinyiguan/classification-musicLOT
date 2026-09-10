import jsPsychInstructions from "@jspsych/plugin-instructions";

// 1. GLOBAL CSS INJECTION (Fixes the button styles reliably across page changes)
const INJECTED_CSS = `
  .state-instructions .jspsych-instructions-nav #jspsych-instructions-back {
    display: none !important;
  }
  .state-instructions .jspsych-instructions-nav .jspsych-btn {
    background-color: #3b82f6 !important;
    color: #ffffff !important;
    border: none !important;
    padding: 10px 20px !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    font-weight: 550 !important;
    font-size: 1.2rem !important;
    transition: background-color 0.2s ease-in-out !important;
  }
  .state-instructions .jspsych-instructions-nav .jspsych-btn:hover {
    background-color: #2563eb !important;
  }
`;

// Helper to inject the style tag once
function ensureStylesInjected() {
  if (!document.getElementById("jspsych-custom-instructions-styles")) {
    const styleEl = document.createElement("style");
    styleEl.id = "jspsych-custom-instructions-styles";
    styleEl.textContent = INJECTED_CSS;
    document.head.appendChild(styleEl);
  }
}

// 2. SHARED INLINE DESIGN TOKENS
const CARD_STYLE = "width: 100%; max-width: 680px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 40px auto; padding: 35px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px;";
const SECTION_TITLE_STYLE = "font-weight: 600; color: #1e293b; font-size: 1.25em; margin: 25px 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;";
const BOX_STYLE = "background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; flex: 1 1 0px; min-width: 0;";
const FOOTER_NAV_STYLE = "margin-top: 30px; text-align: center; color: #64748b; font-size: 0.85rem; font-style: italic; border-top: 1px dashed #e2e8f0; padding-top: 15px;";

export function getInstructions() {
  return {
    type: jsPsychInstructions,
    key_forward: ' ',
    pages: [
      // CARD 1: Welcome & Overview
      `
      <div style="${CARD_STYLE}">
        <div style="${BADGE_HEADER_STYLE}">Experiment Instructions (1/4)</div>
        <div style="margin-bottom: 20px;">
          <h1 style="font-weight: 700; color: #1e293b; font-size: 1.6em; margin: 0 0 10px 0; line-height: 1.3;
              ">Welcome to the Study
          </h1>
          <p style="font-size: 1.05rem; color: #475569; margin: 0;">
            This study consists of two distinct parts:
          </p>
          <ol style="font-size: 1.05rem; color: #1e293b; margin: 15px 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
            <li><strong>Part 1:</strong> A music classification task (~30 mins)</li>
            <li><strong>Part 2:</strong> A short musical background questionnaire (~10 mins)</li>
          </ol>
        </div>
        <div style="margin-top: 30px; background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #d97706; border-radius: 6px; padding: 14px; font-size: 0.9rem; color: #b45309; font-weight: 500;">
          ⚠️ <strong>Requirement:</strong> Please wear headphones and complete the entire session in a quiet environment.
        </div>
        <div style="${FOOTER_NAV_STYLE}">Press SPACE or click the button below to continue</div>
      </div>
      `,

      // CARD 2: Part 1 
      `
      <div style="${CARD_STYLE}">
        <div style="${BADGE_HEADER_STYLE}">Experiment Instructions (2/4)</div>
        <div>
          <h2 style="${SECTION_TITLE_STYLE}">Part 1: Classification Task</h2>
          <div style="${BOX_STYLE} margin-top: 15px;">
            <h3 style="font-size: 1rem; font-weight: bold; margin: 0 0 10px 0; color: #2563eb; text-transform: uppercase; letter-spacing: 0.02em;">Training:</h3>
            <p style="color: #334155">In each trial, </p> 
            <ul style="margin: 0; padding-left: 20px; padding-bottom: 20px; font-size: 1rem; color: #334155; display: flex; flex-direction: column; gap: 10px;">
              <li> Play and listen to all audio samples in the Training Group column on the left.</li>
              <li> You can play them in any order and as many times as necessary.</li>
            </ul>
          </div>
        </div>
        <div style="${FOOTER_NAV_STYLE}">Press SPACE or click the button below to continue</div>
      </div>
      `,

      // CARD 3: Part 1 - Stage 2
      `
      <div style="${CARD_STYLE}">
        <div style="${BADGE_HEADER_STYLE}">Experiment Instructions (3/4)</div>
        <div>
          <h2 style="${SECTION_TITLE_STYLE}">Part 1: Classification Task</h2>
          <div style="${BOX_STYLE} margin-top: 15px;">
            <h3 style="font-size: 1rem; font-weight: bold; margin: 0 0 10px 0; color: #2563eb; text-transform: uppercase; letter-spacing: 0.02em;">Classification:</h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 1rem; color: #334155; display: flex; flex-direction: column; gap: 10px;">
              <li>Play and listen to both options in the right column (you can play them in any order).</li>
              <li><strong>Your goal:</strong> Choose the option you think that best matches the pattern of the Training Group samples.</li>
              <li>After making your choice, rate how confident you are in your answer.</li>
            </ul>
          </div>
        </div>
        <div style="${FOOTER_NAV_STYLE}">Press SPACE or click the button below to continue</div>
      </div>
      `,

      // CARD 4: Part 2 & Finish
      `  
      <div style="${CARD_STYLE}">
        <div style="${BADGE_HEADER_STYLE}">Experiment Instructions (4/4)</div>
        <div>
          <h2 style="${SECTION_TITLE_STYLE}">Part 2: Questionnaire (~10 mins)</h2>
          <div style="${BOX_STYLE} margin-top: 15px;">
            <p style="margin: 0; font-size: 1rem; color: #334155; line-height: 1.5;">
              After the classification task, you will answer a few background questions using dropdowns, sliders, or text boxes. 
            </p>
          </div>
        </div>
        <div style="${FOOTER_NAV_STYLE}">Ready? Click the button below to start the Comprehension Check.</div>
      </div>
      `
    ],
    show_clickable_nav: true,
    show_backward_button: true,
    button_label_next: "Next",
    data: {
      task: "experiment_instructions"
    },
    on_page_change: (page_index: number) => {
      const nextBtn = document.querySelector<HTMLButtonElement>(".jspsych-instructions-nav .jspsych-btn:not(#jspsych-instructions-back)");
      if (nextBtn) {
        nextBtn.textContent = page_index === 3 ? "Comprehension Check >" : "Next >";
      }
    },
    on_load: () => {
      ensureStylesInjected();
      document.body.classList.add("state-instructions");
    },
    on_finish: () => {
      document.body.classList.remove("state-instructions");
    }
  };
}