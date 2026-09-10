import jsPsychInstructions from "@jspsych/plugin-instructions";

// Adjusted margin-top to 60px to drop the card lower on the screen
const CARD_STYLE = "width: 100%; max-width: 620px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); font-family: sans-serif; line-height: 1.5; margin: 60px auto 20px auto; padding: 35px 40px; box-sizing: border-box; text-align: center;";
const CARD_HEADER_STYLE = "background-color: #f0fdf4; color: #16a34a; display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 0.85em; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;";

export function startPracticeTrials() {
    return {
        type: jsPsychInstructions,
        pages: [
            `
            <div style="${CARD_STYLE}">
              <div style="${CARD_HEADER_STYLE}">Comprehension Passed</div>
              <h1 style="margin: 0 0 14px 0; color: #1e293b; font-size: 1.6em; font-weight: 700;">You're all set!</h1>
              
              <div style="color: #475569; font-size: 1.05em; margin-bottom: 10px;">
                <p style="margin: 0 0 12px 0;">
                  You have answered all the comprehension questions correctly.
                </p>
                <p style="margin: 0; color: #64748b; font-size: 0.95em;">
                  When you are ready, click the button below to begin the practice trials.
                </p>
              </div>
            </div>
            `
        ],
        show_clickable_nav: true,
        allow_backward: false, // Prevents the 'Previous' button from rendering entirely
        button_label_next: "Begin Practice Trials",
        data: {
            task: "start_practice_screen"
        },
        on_load: () => {
            document.body.classList.add("state-instructions");

          // Apply the custom branding button styles
          const nextButton = document.querySelector(".jspsych-instructions-nav button");
          if (nextButton) {
            nextButton.setAttribute("style", `
              background-color: #4f46e5 !important; 
              color: #ffffff !important;
              font-family: sans-serif !important;
              font-size: 1.2em !important;
              font-weight: 600 !important;
              padding: 10px 24px !important;
              border: none !important;
              border-radius: 6px !important;
              box-shadow: 0 2px 4px rgba(79, 70, 229, 0.15) !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
            `);
          }
        },
        on_finish: () => {
            document.body.classList.remove("state-instructions");
        }
    };
}