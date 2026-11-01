export interface Question {
  id: string;
  prompt: string;
  type?: 'string' | 'choice'; // Defaults to choice if choices exist
  choices?: string[];
}

// Master list containing every unique question exactly once
export const GOLD_MSI_MASTER_QUESTIONS: Record<string, Question> = {
  // Perception Abilities (pa)
  goldMSI_5: { id: "goldMSI_5", prompt: "I am able to judge whether someone is a good singer or not." },
  goldMSI_6: { id: "goldMSI_6", prompt: "I usually know when I'm hearing a song for the first time." },
  goldMSI_11: { id: "goldMSI_11", prompt: "I find it difficult to spot mistakes in a performance of a song even if I know the tune." },
  goldMSI_12: { id: "goldMSI_12", prompt: "I can compare and discuss differences between two performances or versions of the same piece of music." },
  goldMSI_13: { id: "goldMSI_13", prompt: "I have trouble recognizing a familiar song when played in a different way or by a different performer." },
  goldMSI_18: { id: "goldMSI_18", prompt: "I can tell when people sing or play out of time with the beat." },
  goldMSI_22: { id: "goldMSI_22", prompt: "I can tell when people sing or play out of tune." },
  goldMSI_23: { id: "goldMSI_23", prompt: "When I sing, I have no idea whether I'm in tune or not." },
  goldMSI_26: { id: "goldMSI_26", prompt: "When I hear a music I can usually identify its genre." },

  // Musical Training (mt)
  goldMSI_14: { id: "goldMSI_14", prompt: "I have never been complimented for my talents as a musical performer." },
  goldMSI_27: { id: "goldMSI_27", prompt: "I would not consider myself a musician." },
  goldMSI_32: { id: "goldMSI_32", prompt: "I engaged in regular, daily practice of a musical instrument (including voice) for ___ years.", choices: ["0", "1", "2", "3", "4-5", "6-9", "10"] },
  goldMSI_33: { id: "goldMSI_33", prompt: "At the peak of my interest, I practiced ___ hours per day on my primary instrument.", choices: ["0", "0.5", "1", "1.5", "2", "3-4", "5 or more"] },
  goldMSI_35: { id: "goldMSI_35", prompt: "I have had formal training in music theory for ___ years", choices:["0","0.5","1","2","3","4-6","7 or more"]},
  goldMSI_36: { id: "goldMSI_36", prompt: "I have had __ years of formal training on a musical instrument (including voice) during my lifetime.", choices: ["0","0.5","1","2","3-5","6-9","10 or more"]},
  goldMSI_37: { id: "goldMSI_37", prompt: "I can play ___ musical instruments.", choices: ["0", "1", "2", "3", "4", "5", "6 or more"] },
  goldMSI_39: { id: "goldMSI_39", prompt: "The instrument I play best (including voice) is ____", type: "string" },

  // General Sophistication (msoph) unique items
  goldMSI_1: { id: "goldMSI_1", prompt: "I spend a lot of my free time doing music-related activities." },
  goldMSI_3: { id: "goldMSI_3", prompt: "I enjoy writing about music, for example on blogs and forums." },
  goldMSI_4: { id: "goldMSI_4", prompt: "If somebody starts singing a song I don't know, I can usually join in." },
  goldMSI_7: { id: "goldMSI_7", prompt: "I can sing or play music from memory." },
  goldMSI_10: { id: "goldMSI_10", prompt: "I am able to hit the right notes when I sing along with a recording." },
  goldMSI_15: { id: "goldMSI_15", prompt: "I often read or search the internet for things related to music." },
  goldMSI_17: { id: "goldMSI_17", prompt: "I am not able to sing in harmony when somebody is singing a familiar tune." },
  goldMSI_19: { id: "goldMSI_19", prompt: "I am able to identify what is special about a given musical piece." },
  goldMSI_24: { id: "goldMSI_24", prompt: "Music is kind of an addiction for me - I couldn't live without it." },
  goldMSI_25: { id: "goldMSI_25", prompt: "I don’t like singing in public because I’m afraid that I would sing wrong notes." },
  goldMSI_29: { id: "goldMSI_29", prompt: "After hearing a new song two or three times, I can usually sing it by myself." }
};

// 3. Subscales defined strictly by referencing the master keys
export const goldMSI_subscales = {
  paAgreement: [
    "goldMSI_5", "goldMSI_6", "goldMSI_11", "goldMSI_12",
    "goldMSI_13", "goldMSI_18", "goldMSI_22", "goldMSI_23", "goldMSI_26"
  ],
  mtAgreement: [
    "goldMSI_14", "goldMSI_27"
  ],
  mtrainMC: [
    "goldMSI_32", "goldMSI_33","goldMSI_35","goldMSI_36", "goldMSI_37"
  ],
  msophAgreement: [
    "goldMSI_1", "goldMSI_3", "goldMSI_4", "goldMSI_7", "goldMSI_10",
    "goldMSI_12", "goldMSI_14", "goldMSI_15", "goldMSI_17", 
    "goldMSI_19", "goldMSI_23", "goldMSI_24", "goldMSI_25", "goldMSI_27", "goldMSI_29"
  ],
  msophMC: [
    "goldMSI_32", "goldMSI_33", "goldMSI_37"
  ],
  instrument: ["goldMSI_39"]
};