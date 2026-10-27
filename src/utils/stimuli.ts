import rawTrials from './trialInfos.json';


export interface TrialStimulus {
    trial_id: string;
    train: string[];
    test: string[];
    correctChoice: number
}

// interface representing the raw structure in trialInfos.json
interface RawTrialItem {
    trial: {
        correctChoice: string;
        test: number[],
        train:number[];
    };
}

const base = import.meta.env.BASE_URL;  // <-- ensure the audio path relative to the repo 

export const stimuli: TrialStimulus[] = (rawTrials as RawTrialItem[]).map((item, index) => {
    let correctVal = -1;
    if (item.trial.correctChoice === "First"){
        correctVal = 0;
    } else if (item.trial.correctChoice === "Second"){
        correctVal = 1;
    }
    return {
        trial_id: `trial_${index}`,
        train: item.trial.train.map((id) => `${base}experimentData/classification/Stimuli/wav/${id}.wav`),  
        test: item.trial.test.map((id) => `${base}experimentData/classification/Stimuli/wav/${id}.wav`),   
        correctChoice: correctVal
    }
}
)