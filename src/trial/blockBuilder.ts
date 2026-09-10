import { JsPsych } from "jspsych";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import { buildTrial } from "./trialBuilder";
import type { TrialStimulus } from "../utils/stimuli";

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Updated max-width from 680px to 900px, margin to 30px auto 16px auto, and padding to 48px
const BREAK_CARD_STYLE = "width: 100%; max-width: 900px; max-height: 800px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: sans-serif; line-height: 1.6; margin: 30px auto 16px auto; padding: 48px; box-sizing: border-box; text-align: left;";
const BADGE_HEADER_STYLE = "background-color: #ebf5fa; color: #059669; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 25px;";

export function createBreakTrial(blockIndex: number, totalBlocks: number) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="${BREAK_CARD_STYLE}">
              <div style="${BADGE_HEADER_STYLE}">Progress: Block ${blockIndex} of ${totalBlocks}</div>
              <div style="margin-bottom: 20px;">
                <h1 style="font-weight: 700; color: #1e293b; font-size: 1.6em; margin: 0 0 15px 0;">Block Completed!</h1>
                <p style="font-size: 1.15rem; color: #475569; margin: 0 0 12px 0;">Take a moment to rest and stretch before continuing.</p>
                <p style="font-size: 1.05rem; color: #64748b; margin: 0;">Click the button below when you are ready to start the next block.</p>
              </div>
            </div>
        `,
        choices: ["Continue"],
        data: { task: "block_break", completed_block: blockIndex },
        on_load: () => {
            document.body.classList.add("state-transition");
            const nextBtn = document.querySelector<HTMLButtonElement>("#jspsych-html-button-response-button-0 button");
            if (nextBtn) {
                nextBtn.style.backgroundColor = "#3b82f6";
                nextBtn.style.color = "#ffffff";
                nextBtn.style.border = "none";
                nextBtn.style.padding = "12px 28px";
                nextBtn.style.borderRadius = "6px";
                nextBtn.style.cursor = "pointer";
                nextBtn.style.fontWeight = "600";
                nextBtn.style.fontSize = "1.1rem";

                nextBtn.addEventListener("mouseover", () => nextBtn.style.backgroundColor = "#2563eb");
                nextBtn.addEventListener("mouseout", () => nextBtn.style.backgroundColor = "#3b82f6");
            }
        },
        on_finish: () => {
            document.body.classList.remove("state-transition");
        }
    };
}

export function buildBlockTimeline(
    jsPsych: JsPsych,
    allStimuli: TrialStimulus[],
    participantId: string | number
): any[] {
    const timeline: any[] = [];

    // Group stimuli by complexity tier
    const tierMap: Record<number, TrialStimulus[]> = { 1: [], 2: [], 3: [], 4: [] };
    allStimuli.forEach(stim => {
        if (tierMap[stim.tier]) tierMap[stim.tier].push(stim);
    });

    // Randomize within tiers
    const block1_Trials = shuffleArray(tierMap[1]);
    const block2_Trials = shuffleArray(tierMap[2]);
    const block3_Trials = shuffleArray(tierMap[3]);
    const block4_Trials = shuffleArray(tierMap[4]);

    // Latin Square block order assignment
    const blockOrders = [
        [1, 2, 3, 4],
        [2, 4, 1, 3],
        [3, 1, 4, 2],
        [4, 3, 2, 1]
    ];

    const idNum = typeof participantId === "number" 
        ? participantId 
        : participantId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const assignedOrder = blockOrders[idNum % blockOrders.length];

    const blocksDataMatrix = {
        1: block1_Trials,
        2: block2_Trials,
        3: block3_Trials,
        4: block4_Trials
    };
    
    console.log(`Participant matching assignment order: ${assignedOrder.join(" -> ")}`);

    assignedOrder.forEach((tierId, index) => {
        const targetBlockStimuli = blocksDataMatrix[tierId as keyof typeof blocksDataMatrix];
        const blockNumber = index + 1;

        targetBlockStimuli.forEach((stimulus) => {
            // Generates classification trial using buildTrial
            const compiledTrialSteps = buildTrial(jsPsych, stimulus);

            compiledTrialSteps.forEach(step => {
                step.data = Object.assign({}, step.data, {
                    block_number: blockNumber,
                    complexity_tier: tierId,
                });
            });

            timeline.push(...compiledTrialSteps);
        });

        // Add break between blocks
        if (index < assignedOrder.length - 1 && targetBlockStimuli.length > 0) {
            timeline.push(createBreakTrial(blockNumber, assignedOrder.length));
        }
    });

    return timeline;
}