import jsPsychInstructions from "@jspsych/plugin-instructions";

// Match the structural style used across your headphone check and Gold-MSI cards
const CARD_STYLE = "width: 100%; max-width: 680px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 60px auto; padding: 40px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase;  margin-bottom: 25px;";

export const debrief = {
    type: jsPsychInstructions,
    pages: [
        `
        <div style="${CARD_STYLE}">
          <div style="${BADGE_HEADER_STYLE}">
            Experiment Completed
          </div>
          
          <div style="margin-bottom: 20px;">
            <h1 style="font-weight: 700; color: #1e293b; font-size: 1.3em; margin: 0 0 15px 0; line-height: 1.3;">
              Thank you !
            </h1>
            <p style="font-size: 1.1rem; color: #475569; margin: 0; line-height: 1.6;">
                To confirm your submission of all experimental data, please click the "Finish" button below.
            </p>
          </div>
        </div>
        `
    ],
    show_clickable_nav: true,
    allow_backward: false,
    button_label_next: "Finish!",
    data: {
      task: "debrief_screen"
    },
    on_load: () => {
        document.body.classList.add("state-transition");

        // Select ALL nav buttons instead of just one
        const navButtons = document.querySelectorAll<HTMLButtonElement>(".jspsych-instructions-nav .jspsych-btn");
        
        navButtons.forEach(btn => {
            btn.style.backgroundColor = "#3b82f6";
            btn.style.color = "#ffffff";
            btn.style.border = "none";
            btn.style.padding = "10px 20px";
            btn.style.borderRadius = "6px";
            btn.style.cursor = "pointer";
            btn.style.fontWeight = "600";
            btn.style.fontSize = "1.2rem";
            btn.style.transition = "background-color 0.2s";

            btn.addEventListener("mouseover", () => btn.style.backgroundColor = "#2563eb");
            btn.addEventListener("mouseout", () => btn.style.backgroundColor = "#3b82f6");
        });
    },
    on_finish: () => {
        document.body.classList.remove("state-transition");
    }
};