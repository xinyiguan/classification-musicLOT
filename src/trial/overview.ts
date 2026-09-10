import jsPsychInstructions from "@jspsych/plugin-instructions";

// Match the structural style used across your headphone check and Gold-MSI cards
const CARD_STYLE = "width: 100%; max-width: 680px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 30px auto; padding: 40px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;";

export const overview = {
    type: jsPsychInstructions,
    pages: [
        `
        <h1 style="font-weight: 700; color: #1e293b; font-size: 1.3em; margin: 100px 0 0 0; line-height: 1.3;text-align: center;">
            Thank you for choosing to participate in this study!
        </h1>
        <div style="${CARD_STYLE}">
          <div style="${BADGE_HEADER_STYLE}">
            Guidelines
          </div>
          <div style="margin-bottom: 15px;">
            <p>
            </p>
            <p style="font-size: 1.1rem; color: #2d3643; margin: 0 0 1rem 0; line-height: 1.6; font-weight: 500;">
            Before you begin, please note the following guidelines:
            </p>
            <ol style="font-size: 1rem; color: #2d3643; margin: 0; padding-left: 1.5rem; line-height: 1.6;">
                <style>
                    ol.spaced-list li { margin-bottom: 0.75rem; }
                    ol.spaced-list li:last-child { margin-bottom: 0; }
                </style>
            </ol>

            <!-- Cleaned up structure with inline styles for individual items -->
            <ol style="font-size: 1rem; color: #2d3643; margin: 0; padding-left: 1.5rem; line-height: 1.6;">
                <li style="margin-bottom: 0.75rem;">Please wear headphones and ensure your environment remains quiet throughout the session.</li>
                <li style="margin-bottom: 0.75rem;">You will complete a brief headphone check and comprehension quiz to unlock the main experiment.</li>
                <li style="margin-bottom: 0.75rem;">Please minimize potential distractions by closing messaging apps, email, and background music.</li>
                <li style="margin-bottom: 0;">To protect your progress, please do not refresh this page during the experiment.</li>
            </ol>

            
          </div>
        </div>
        `
    ],
    show_clickable_nav: true,
    allow_backward: false,
    button_label_next: "Headphone Check",
    data: {
        task: "study_overview"
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
};