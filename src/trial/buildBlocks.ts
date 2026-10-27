import { JsPsych } from "jspsych";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import { buildTrial } from "./buildTrials"; 
import type { TrialStimulus } from "../utils/stimuli";

// Helper: Fisher-Yates Shuffle
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Creates a self-paced rest node between blocks
 */
const CARD_STYLE = "width: 100%; max-width: 680px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 60px auto; padding: 40px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 25px;";

export function createBreakTrial(blockIndex: number, totalBlocks: number) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="${CARD_STYLE}">
              <div style="${BADGE_HEADER_STYLE}">
                Progress: Block ${blockIndex} of ${totalBlocks}
              </div>
              
              <div style="margin-bottom: 20px;">
                <h1 style="font-weight: 700; color: #1e293b; font-size: 1.3em; margin: 0 0 15px 0; line-height: 1.3;">
                  Block Completed!
                </h1>
                <p style="font-size: 1.1rem; color: #475569; margin: 0 0 15px 0; line-height: 1.6;">
                  Take a moment to rest and catch your breath. 
                </p>
                <p style="font-size: 1.1rem; color: #475569; margin: 0; line-height: 1.6;">
                  When you are ready to continue to the next set of melodies, click the button below to resume the experiment.
                </p>
              </div>
            </div>
        `,
        choices: ["Continue >"],
        data: { task: "block_break", completed_block: blockIndex },
        on_load: () => {
            document.body.classList.add("state-transition");

            const nextBtn = document.querySelector<HTMLButtonElement>("#jspsych-html-button-response-button-0 button");
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
}

/**
 * Builds the complete sequential multi-block timeline with breaks.
 * @param jsPsych The jsPsych instance
 * @param allStimuli Complete list of testing stimuli
 */
export function buildBlockTimeline(
    jsPsych: JsPsych,
    allStimuli: TrialStimulus[]
): any[] {
    const timeline: any[] = [];

    // 1. Fully randomize all stimuli together
    const shuffledStimuli = shuffleArray(allStimuli);

    // 2. Split the shuffled stimuli into 4 roughly equal groups/blocks
    const numBlocks = 4;
    const blockSize = Math.ceil(shuffledStimuli.length / numBlocks);
    const blocksDataMatrix: TrialStimulus[][] = [];

    for (let i = 0; i < numBlocks; i++) {
        const start = i * blockSize;
        const end = start + blockSize;
        blocksDataMatrix.push(shuffledStimuli.slice(start, end));
    }

    // 3. Construct the linear timeline structure sequentially (Block 1 -> 2 -> 3 -> 4)
    blocksDataMatrix.forEach((targetBlockStimuli, index) => {
        const blockNumber = index + 1; // 1-based sequential presentation order (1, 2, 3, or 4)

        // Process all balanced trials within this block segment
        targetBlockStimuli.forEach((stimulus) => {
            const trialObj = buildTrial(jsPsych, "main", stimulus); // <-- returns single trial object

            // Tag metadata dynamically to raw data output tracking across layers
            trialObj.data = Object.assign({}, trialObj.data, {
                block_number: blockNumber, // Sequential position in presentation order
                original_block_group: blockNumber,
            });

            timeline.push(trialObj);
        });

        // Insert self-paced breaks between blocks (omit after the final block)
        if (index < blocksDataMatrix.length - 1) {
            timeline.push(createBreakTrial(blockNumber, blocksDataMatrix.length));
        }
    });

    return timeline;
}