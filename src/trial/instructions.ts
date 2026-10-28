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
const CARD_STYLE = "width: 680px; min-width: 680px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 40px auto; padding: 35px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px;";
const SECTION_TITLE_STYLE = "font-weight: 600; color: #1e293b; font-size: 1.25em; margin: 25px 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;";
const BOX_STYLE = "width: 100%; box-sizing: border-box; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px;";
const FOOTER_NAV_STYLE = "margin-top: 30px; text-align: center; color: #64748b; font-size: 0.85rem; font-style: italic; border-top: 1px dashed #e2e8f0; padding-top: 15px;";

export function getInstructions() {
  return {
    type: jsPsychInstructions,
    pages: [
      // CARD 1: Welcome & Overview (1/3)
      `
      <div style="${CARD_STYLE}">
        <div style="${BADGE_HEADER_STYLE}">Experiment Instructions (1/3)</div>
        <div style="margin-bottom: 20px;">
          <h1 style="font-weight: 700; color: #1e293b; font-size: 1.6em; margin: 0 0 10px 0; line-height: 1.3;">Welcome to the Study</h1>
          <p style="font-size: 1.05rem; color: #475569; margin: 0;">
            This study consists of two distinct parts:
          </p>
          <div style="margin-top: 20px; ${BOX_STYLE}">
            <ul style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 1rem; color: #334155;">
              <li><strong>Part 1:</strong> A music classification task (~50 mins)</li>
              <li><strong>Part 2:</strong> A short questionnaire (~10 mins)</li>
            </ul>
          </div>
        </div>
        <div style="margin-top: 20px; background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #d97706; border-radius: 6px; padding: 14px; font-size: 0.9rem; color: #b45309; font-weight: 500;">
          <strong>Requirement:</strong> Please wear headphones and complete the entire session in a quiet environment.
        </div>
        <div style="${FOOTER_NAV_STYLE}">Click the button below to continue</div>
      </div>
      `,

      // CARD 2: Part 1 - Hierarchical Tap-to-Reveal Training & Classification (2/3)
      `
      <div style="${CARD_STYLE} min-height: 480px; display: flex; flex-direction: column; justify-content: space-between;" id="card-2-container">
        <div>
          <div style="${BADGE_HEADER_STYLE}">Experiment Instructions (2/3)</div>
          <h2 style="${SECTION_TITLE_STYLE}; margin-top: 0;">Part 1: Classification Task Procedure</h2>
          
          <div style="margin-top: 15px; ${BOX_STYLE}; display: flex; flex-direction: column; gap: 16px;">
            <!-- Training Group -->
            <div>
              <div style="font-size: 0.95em; font-weight: bold; color: #2563eb; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 6px;">
                Learning Phase
              </div>
              <ul style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95em; color: #334155;">
                <li class="reveal-item" style="display: none;" data-tag="li">
                  Listen to all melody samples in the Training Group column on the left.
                </li>
                <li class="reveal-item" style="display: none;" data-tag="li">
                  You can play them in any order and as many times as necessary.
                </li>
              </ul>
            </div>

            <!-- Classification Group -->
            <div class="reveal-item" style="display: none; border-top: 1px solid #e2e8f0; padding-top: 14px;" data-tag="div">
              <div style="font-size: 0.95em; font-weight: bold; color: #2563eb; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 6px;">
                Classification Phase
              </div>
              <ul style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95em; color: #334155;">
                <li class="reveal-item" style="display: none;" data-tag="li">
                  Listen to both options in the right column (you can play them in any order).
                </li>
                <li class="reveal-item" style="display: none;" data-tag="li">
                  <strong>Your goal:</strong> Choose the option you think best matches the pattern of the Training Group samples.
                </li>
                <li class="reveal-item" style="display: none;" data-tag="li">
                  After making your choice, rate how confident you are in your answer.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div id="instruction-hint-card2" style="text-align: center; margin-top: 5px; font-size: 0.85rem; color: #94a3b8; font-weight: 500;">
          Press <kbd style="background: #f1f5f9; padding: 2px 2px; border-radius: 4px; border: 1px solid #cbd5e1;">Space</kbd> to reveal next step
        </div>
      </div>
      `,

      // CARD 3: Part 2 & Finish (3/3)
      `
      <div style="${CARD_STYLE}">
        <div style="${BADGE_HEADER_STYLE}">Experiment Instructions (3/3)</div>
        <div>
          <h2 style="${SECTION_TITLE_STYLE}">Part 2: Questionnaire (~10 mins)</h2>
          <div style="margin-top: 15px; ${BOX_STYLE}">
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
    show_backward_button: false,
    button_label_next: "Next",
    data: {
      task: "experiment_instructions"
    },
    on_page_change: (page_index: number) => {
      const nextBtn = document.querySelector<HTMLButtonElement>(".jspsych-instructions-nav .jspsych-btn:not(#jspsych-instructions-back)");
      if (nextBtn) {
        nextBtn.textContent = page_index === 2 ? "Comprehension Check >" : "Next >";
      }

      if (page_index === 1) {
        setTimeout(() => setupCard2Steps(), 50);
      }
    },
    on_load: () => {
      ensureStylesInjected();
      document.body.classList.add("state-instructions");
      setupCard2Steps();
      setupGlobalKeyBlocker();
    },
    on_finish: () => {
      document.body.classList.remove("state-instructions");
    }
  };
}

// Blocks arrow keys from triggering default page progression
function setupGlobalKeyBlocker() {
  const blockKeys = (e: KeyboardEvent) => {
    if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };
  window.addEventListener("keydown", blockKeys, { capture: true });
}

function setupCard2Steps() {
  const container = document.getElementById("card-2-container");
  if (!container) return;

  const revealItems = container.querySelectorAll<HTMLElement>(".reveal-item");
  const hintEl = document.getElementById("instruction-hint-card2");
  const nextBtn = document.querySelector<HTMLButtonElement>(".jspsych-instructions-nav .jspsych-btn:not(#jspsych-instructions-back)");

  if (revealItems.length === 0) return;

  // Initially hide/disable next button on Card 2 until fully revealed
  if (nextBtn) {
    nextBtn.style.opacity = "0.3";
    nextBtn.style.pointerEvents = "none";
  }

  let currentIndex = -1; // Start at -1 so nothing is shown initially
  revealItems.forEach((item, idx) => {
    if (item.style.display && item.style.display !== "none") {
      currentIndex = idx;
    }
  });

  if (currentIndex >= revealItems.length - 1) {
    if (hintEl) hintEl.style.visibility = "hidden";
    if (nextBtn) {
      nextBtn.style.opacity = "1";
      nextBtn.style.pointerEvents = "auto";
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const activeContainer = document.getElementById("card-2-container");
    if (!activeContainer) {
      window.removeEventListener("keydown", handleKeyDown, true);
      return;
    }

    if (e.code === "Space") {
      if (currentIndex < revealItems.length - 1) {
        e.preventDefault();
        e.stopImmediatePropagation();

        currentIndex++;
        const target = revealItems[currentIndex];
        const tag = target.getAttribute("data-tag");
        target.style.display = tag === "li" ? "list-item" : "block";

        if (currentIndex === revealItems.length - 1) {
          if (hintEl) hintEl.style.visibility = "hidden";
          if (nextBtn) {
            nextBtn.style.opacity = "1";
            nextBtn.style.pointerEvents = "auto";
          }
          window.removeEventListener("keydown", handleKeyDown, true);
        }
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown, { capture: true });
}