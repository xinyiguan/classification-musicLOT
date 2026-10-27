import { JsPsych } from "jspsych";
import { buildTrial } from "./buildTrials";
import { stimuli } from "../utils/stimuli";
import type { Phase } from "../main";

/**
 * Mutates individual trial nodes to display a practice badge, push the card layout down, 
 * and securely manage the custom visibility state classes.
 */
function preparePracticeTrial(trialObject: any) {
    const originalOnStart = trialObject.on_start;
    trialObject.on_start = function (trial: any) {
        if (originalOnStart) originalOnStart(trial);
        document.body.classList.add("in-practice-phase");
    };
    return trialObject;
}

// ============================================================================
// PRACTICE TIMELINE BUILDER
// ============================================================================
export function getPracticeTimeline(jsPsych: JsPsych, indices: number[]) {
    const practiceItems = indices.map((idx, index) => {
        const trialId = `trial_${idx}`;  
        const item = stimuli.find((s) => s.trial_id === trialId);

        if (!item) {
            throw new Error(`Stimulus with trial_id "${trialId}" not found.`);
        }

        return {
            ...item,
            trial_id: trialId,
            phase: "practice" as Phase,
            practiceLabel: `Practice Trial ${index + 1}/${indices.length}`
        };
    });

    const nodes: any[] = [];

    practiceItems.forEach((stim, index) => {
        // Use buildTrial instead of createClassificationTrial to get the full jsPsych trial object
        const trialObj = buildTrial(jsPsych, "practice", stim, stim.practiceLabel);
        const formattedTrial = preparePracticeTrial(trialObj);

        // Clean up global practice styles on the final practice trial finish
        if (index === practiceItems.length - 1) {
            const originalFinish = formattedTrial.on_finish;
            formattedTrial.on_finish = function (data: any) {
                if (originalFinish) originalFinish(data);
                document.body.classList.remove("in-practice-phase");
                const practiceStyleNode = document.getElementById("practice-global-hide-bar");
                if (practiceStyleNode) practiceStyleNode.remove();
            };
        }

        nodes.push(formattedTrial);
    });

    return {
        timeline: nodes
    };
}