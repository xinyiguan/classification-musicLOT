import jsPsychInstructions from "@jspsych/plugin-instructions";

// Match the structural style used across your headphone check and Gold-MSI cards
const CARD_STYLE = "width: 100%; max-width: 680px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 60px auto; padding: 40px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 25px;";

export const transition = {
    type: jsPsychInstructions,
    pages: [
        `
        <div style="${CARD_STYLE}">
          <div style="${BADGE_HEADER_STYLE}">
            Part II: Questionnaire
          </div>
          
          <div style="margin-bottom: 20px;">
            <h1 style="font-weight: 700; color: #1e293b; font-size: 1.3em; margin: 0 0 15px 0; line-height: 1.3;">
              Experimental Session Completed !
            </h1>
            <p>
            </p>
            <p style="font-size: 1.1rem; color: #475569; margin: 0; line-height: 1.6;">
             Next, we would like to ask you a few questions about your <b>musical background and habits</b>.
            </p>
            <p>
            </p>
            <p style="font-size: 1.1rem; color: #475569; margin: 0; line-height: 1.6;">
            <b>Instructions</b>: For each question, select an option, use the slider, or type your response. 
            To continue to the next question, either click "Continue" or wait for tap the SPACE bar.
          
            </p>

          </div>
        </div>
        `
    ],
    show_clickable_nav: true,
    allow_backward: false,
    button_label_next: "Questionnaire",
    data: {
      task: "part_transition_screen"
    },
    on_load: () => {
        document.body.classList.add("state-transition");

        // Minor tweak to make sure the built-in jsPsych instructions button matches your app UI colors smoothly
        const nextBtn = document.querySelector<HTMLButtonElement>(".jspsych-instructions-nav .jspsych-btn");
        if (nextBtn) {
            nextBtn.style.backgroundColor = "#3b82f6";
            nextBtn.style.color = "#ffffff";
            nextBtn.style.border = "none";
            nextBtn.style.padding = "10px 20px";
            nextBtn.style.borderRadius = "6px";
            nextBtn.style.cursor = "pointer";
            nextBtn.style.fontWeight = "600";
            nextBtn.style.fontSize = "1.2rem";
            nextBtn.style.transition = "background-color 0.2s";

            nextBtn.addEventListener("mouseover", () => nextBtn.style.backgroundColor = "#2563eb");
            nextBtn.addEventListener("mouseout", () => nextBtn.style.backgroundColor = "#3b82f6");
        }
    },
    on_finish: () => {
        document.body.classList.remove("state-transition");
    }
};