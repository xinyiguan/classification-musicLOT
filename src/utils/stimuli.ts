export interface TrialStimulus {
    trial_id: string;
    trainAudio: string[];         // G1
    testAudio: string[];        // [G2, G3, etc.] depending on Type
    correct_index: number;  // Index in options array, or -1 for "No Match"
    tier: 1 | 2 | 3 | 4;    // Complexity tier 
    foil_type: "1" | "2" | "3" | "4a" | "4b";
}

const base = import.meta.env.BASE_URL;  // <-- ensure the audio path relative to the repo 

export const stimuli: TrialStimulus[] = [
    {
        trial_id: "trial_001",
        trainAudio: [`${base}audio/sample.wav`,`${base}audio/sample.wav`,`${base}audio/sample.wav`],
        testAudio: [`${base}audio/sample.wav`,`${base}audio/sample.wav`],
        correct_index: 1,
        tier: 2, 
        foil_type:"2"
    },
        {
        trial_id: "trial_002",
        trainAudio: [`${base}audio/sample.wav`],
        testAudio: [`${base}audio/sample.wav`,`${base}audio/sample.wav`],
        correct_index: 0,
        tier: 1, 
        foil_type:"2"
    },
        {
        trial_id: "trial_003",
        trainAudio: [`${base}audio/sample.wav`,`${base}audio/sample.wav`],
        testAudio: [`${base}audio/sample.wav`,`${base}audio/sample.wav`],
        correct_index: 1,
        tier: 4, 
        foil_type:"2"
    },
        {
        trial_id: "trial_004",
        trainAudio: [`${base}audio/sample.wav`],
        testAudio: [`${base}audio/sample.wav`,`${base}audio/sample.wav`],
        correct_index: 1,
        tier: 3, 
        foil_type:"2"
    },
        {
        trial_id: "trial_005",
        trainAudio: [`${base}audio/sample.wav`],
        testAudio: [`${base}audio/sample.wav`,`${base}audio/sample.wav`],
        correct_index: 0,
        tier: 2, 
        foil_type:"2"
    },
];

