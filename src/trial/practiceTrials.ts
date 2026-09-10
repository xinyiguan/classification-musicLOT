import { JsPsych } from "jspsych";
import { buildTrial } from "./trialBuilder";

const base = import.meta.env.BASE_URL;

interface JsPsychTrial {
    stimulus?: string | ((...args: any[]) => string);
    pages?: string[] | ((...args: any[]) => string[]);
    on_start?: (trial: any) => void;
    data?: Record<string, any>;
    [key: string]: any;
}

type TrialInput = JsPsychTrial | JsPsychTrial[];
type TrialOutput<T extends TrialInput> = T extends JsPsychTrial[] ? JsPsychTrial[] : JsPsychTrial;

// ============================================================================
// PROGRESS BAR LIFECYCLE MANAGEMENT
// ============================================================================

function injectPracticeGlobalStyles(): void {
    if (document.getElementById("practice-global-hide-bar")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "practice-global-hide-bar";
    styleEl.innerHTML = `
        body.in-practice-phase #jspsych-progressbar-container,
        body.in-practice-phase .jspsych-progressbar-container {
            display: none !important;
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(styleEl);
}

function applyBadgeAndStyles(html: string, labelText: string): string {
    const practiceBadgeHtml = `
        <div class="practice-badge-top-right" style="position: absolute; top: 30px; right: 30px; z-index: 10;">
                <div style="background-color: #f0e5f8; color: #8630c8; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: bold; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                ${labelText}
            </div>
        </div>
    `;

    // 1. Remove/hide existing tier badge elements if present
    const tierBadgeRegex = /<([a-z0-9]+)[^>]*>(?:\s*tier\s*\d*|\s*tier classification\s*)<\/\1>/gi;
    const tierClassRegex = /<([a-z0-9]+)[^>]*class="[^"]*(?:tier|badge|classification)[^"]*"[^>]*>[\s\S]*?<\/\1>/gi;

    html = html.replace(tierBadgeRegex, "").replace(tierClassRegex, "");

    // 2. Inject the top-right badge inside the card container (ensuring relative positioning)
    const cardRegex = /(<div[^>]*class="[^"]*card[^"]*"[^>]*>)/i;

    if (cardRegex.test(html)) {
        // Ensure the card container has relative positioning so absolute placement works
        html = html.replace(cardRegex, `$1${practiceBadgeHtml}`);
        html = html.replace(/class="([^"]*card[^"]*)"/i, 'class="$1" style="position: relative;"');
    } else {
        // Fallback: Wrap in a relative container if no card class is found
        html = `<div style="position: relative;">${practiceBadgeHtml}${html}</div>`;
    }

    return html.replace(/margin:\s*20px\s+auto;?/g, "margin: 60px auto 20px auto;");
}

/**
 * Mutates dynamic trial nodes with explicit return type annotations to satisfy TS recursive inference.
 */
function preparePracticeTrial<T extends TrialInput>(trialObject: T, labelText: string): TrialOutput<T> {
    injectPracticeGlobalStyles();

    if (Array.isArray(trialObject)) {
        return trialObject.map((subTrial) => 
            preparePracticeTrial(subTrial, labelText)
        ) as TrialOutput<T>;
    }

    const singleTrial = trialObject as JsPsychTrial;

    singleTrial.data = Object.assign({}, singleTrial.data, {
        task: "practice_trials"
    });

    if (singleTrial.stimulus !== undefined) {
        const originalStimulus = singleTrial.stimulus;
        singleTrial.stimulus = function (...args: any[]) {
            const html = typeof originalStimulus === "function" ? originalStimulus(...args) : originalStimulus;
            return applyBadgeAndStyles(html, labelText);
        };
    } else if (singleTrial.pages !== undefined) {
        const originalPages = singleTrial.pages;
        singleTrial.pages = function (...args: any[]) {
            const pages = typeof originalPages === "function" ? originalPages(...args) : originalPages;
            return pages.map((page: string) => applyBadgeAndStyles(page, labelText));
        };
    }

    const originalOnStart = singleTrial.on_start;
    singleTrial.on_start = function (trial: any) {
        if (originalOnStart) originalOnStart(trial);
        document.body.classList.add("in-practice-phase");
    };

    return singleTrial as TrialOutput<T>;
}

// ============================================================================
// DYNAMIC PRACTICE BLOCK GENERATOR
// ============================================================================

export function getPracticeTrials(jsPsych: JsPsych): JsPsychTrial[] {
    const practice1 = preparePracticeTrial(
        buildTrial(jsPsych, {
            trial_id: "practiceTrial_01",
            trainAudio: [`${base}audio/sample.wav`, `${base}audio/sample.wav`],
            testAudio: [`${base}audio/sample.wav`, `${base}audio/sample.wav`],
            correct_index: 1,
            tier: 4, 
            foil_type: "2"
        }),
        "Practice Trial 1/2"
    );

    const practice2 = preparePracticeTrial(
        buildTrial(jsPsych, {
            trial_id: "practiceTrial_02",
            trainAudio: [`${base}audio/sample.wav`, `${base}audio/sample.wav`],
            testAudio: [`${base}audio/sample.wav`, `${base}audio/sample.wav`],
            correct_index: 0,
            tier: 4, 
            foil_type: "2"
        }),
        "Practice Trial 2/2"
    );

    return [
        ...(Array.isArray(practice1) ? practice1 : [practice1]),
        ...(Array.isArray(practice2) ? practice2 : [practice2])
    ];
}