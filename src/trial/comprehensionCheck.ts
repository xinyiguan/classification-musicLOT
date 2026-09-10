import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";

// Shared style constants matching your app design tokens
const CARD_STYLE = "width: 680px; max-width: 680px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 40px auto; padding: 35px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px;";

const CC_QUESTIONS = [
    {
        id: "play_count",
        prompt: "How many times can you replay the melodies?",
        correctAnswer: "As many times as I need",
        options: [
            "As many times as I need",
            "Only once",
            "Twice",
            "Three times"
        ]
    },
    {
        id: "classification_task",
        prompt: "What is your primary objective when evaluating the options in the right column?",
        correctAnswer: "Pick the option that belongs to the training group",
        options: [
            "Pick the option that sounds the longest",
            "Pick randomly",
            "Pick the option that belongs to the training group",
            "Adjust the volume of the sound"
        ]
    }
];

export function buildComprehensionTimeline(_jsPsych: any) {
    const timeline: any[] = [];
    const totalQuestions = CC_QUESTIONS.length;

    const injectStyles = () => {
        if (document.getElementById("cc-individual-styles")) return;
        const styleEl = document.createElement("style");
        styleEl.id = "cc-individual-styles";
        styleEl.innerHTML = `
            .cc-radio-label {
                display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 14px 16px; 
                border: 1px solid #cbd5e1; border-radius: 8px; background-color: #f8fafc; 
                transition: all 0.2s ease-in-out; margin-bottom: 10px; width: 100%; box-sizing: border-box;
            }
            .cc-radio-label:hover { background-color: #f1f5f9; border-color: #94a3b8; }
            .cc-radio-label.selected { background-color: #ebf5fa; border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }
            .cc-radio-input { cursor: pointer; transform: scale(1.15); margin: 0; }
        `;
        document.head.appendChild(styleEl);
    };

    CC_QUESTIONS.forEach((question, index) => {
        let currentSelection: string | null = null;
        let autoTransitionTimeout: number | null = null; // Changed type from NodeJS.Timeout to number for browser environments
        const trial = {
            type: jsPsychHtmlButtonResponse,
            data: {
                task: "comprehension_check",
                questionId: question.id
            },
            stimulus: () => `
                <div style="${CARD_STYLE}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div style="${BADGE_HEADER_STYLE}">Comprehension Check</div>
                        <span style="font-size: 0.85em; color: #64748b; font-weight: 600;">Question ${index + 1} of ${totalQuestions}</span>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <p style="font-weight: 600; color: #1e293b; font-size: 1.25em; margin: 0; line-height: 1.4;">
                            ${question.prompt}
                        </p>
                    </div>

                    <div style="display: flex; flex-direction: column; width: 100%;">
                        ${question.options.map((option: string) => `
                            <label class="cc-radio-label">
                                <input type="radio" name="${question.id}" value="${option}" class="cc-radio-input" />
                                <span style="font-size: 0.95rem; color: #334155; font-weight: 500;">${option}</span>
                            </label>
                        `).join("")}
                    </div>

                    <div class="cc-feedback" style="margin-top: 15px; min-height: 24px; font-size: 0.95em;"></div>
                </div>
            `,
            // Restored the button label choice option array structure
            choices: ["Continue manually >"],
            on_load: () => {
                injectStyles();

                const radios = Array.from(document.querySelectorAll<HTMLInputElement>(".cc-radio-input"));
                const feedback = document.querySelector<HTMLElement>(".cc-feedback");
                const continueBtn = document.querySelector<HTMLButtonElement>(".jspsych-btn");

                // Initially disable manual button until they click something
                if (continueBtn) {
                    continueBtn.disabled = true;
                    // Styling the restored continue button to match your modern UI
                    continueBtn.style.backgroundColor = "#3b82f6";
                    continueBtn.style.color = "#ffffff";
                    continueBtn.style.border = "none";
                    continueBtn.style.padding = "10px 22px";
                    continueBtn.style.borderRadius = "6px";
                    continueBtn.style.cursor = "not-allowed";
                    continueBtn.style.opacity = "0.5";
                    continueBtn.style.fontWeight = "600";
                    continueBtn.style.fontSize = "0.95rem";
                    continueBtn.style.marginTop = "20px";
                    continueBtn.style.transition = "all 0.2s";
                }

                radios.forEach((radio) => {
                    radio.addEventListener("change", (e) => {
                        const target = e.target as HTMLInputElement;
                        currentSelection = target.value;

                        // Reset any pending timers immediately if they switch answers mid-wait
                        if (autoTransitionTimeout) {
                            clearTimeout(autoTransitionTimeout);
                        }

                        radios.forEach(r => r.parentElement?.classList.remove("selected"));
                        radio.parentElement?.classList.add("selected");

                        // Activate the continue button visually and functionally
                        if (continueBtn) {
                            continueBtn.disabled = false;
                            continueBtn.style.cursor = "pointer";
                            continueBtn.style.opacity = "1";

                            // Re-apply hover styles dynamically
                            continueBtn.addEventListener("mouseover", () => continueBtn.style.backgroundColor = "#2563eb");
                            continueBtn.addEventListener("mouseout", () => continueBtn.style.backgroundColor = "#3b82f6");
                        }

                        // Evaluate and show precise live feedback
                        if (feedback) {
                            const isCorrect = currentSelection === question.correctAnswer;
                            if (isCorrect) {
                                feedback.innerHTML = `<span style="color: #059669; font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">✓ Correct!</span>`;
                            } else {
                                feedback.innerHTML = `<span style="color: #dc2626; font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">✗ Incorrect</span>`;
                            }
                        }

                        // Start clean 1s automatic transition countdown loop
                        autoTransitionTimeout = setTimeout(() => {
                            if (continueBtn) {
                                continueBtn.click();
                            }
                        }, 1000);
                    });
                });
                window.scrollTo(0, 0);
            },
            on_finish: (data: any) => {
                data.response = currentSelection;
            }
        };

        timeline.push(trial);
    });

    return timeline;
}