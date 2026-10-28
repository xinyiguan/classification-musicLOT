import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import "./assets/style.css";

import { consent } from "./trial/consent"; 
import { overview } from "./trial/overview.ts";
import { getPracticeTimeline } from "./trial/practiceTrials"
import { createHeadphoneCheck } from "./trial/headphoneCheck"
import { getInstructions } from "./trial/instructions";
import { buildComprehensionTimeline } from "./trial/comprehensionCheck";
import { startPracticeTrials } from "./trial/startPracticeTrials.ts";
import { startExperiment } from "./trial/startExperiment.ts";

import { buildBlockTimeline } from "./trial/buildBlocks"
import { stimuli } from "./utils/stimuli";
import { transition } from "./trial/transition";
import { buildGoldMSITimeline } from "./trial/goldMSI";
import { buildDemographicsTimeline } from "./trial/demographics"; 
import { debrief } from "./trial/debrief";

export type Phase = "practice" | "main"

const urlParams = new URLSearchParams(window.location.search);
const isProlific = urlParams.has('PROLIFIC_PID');
const prolificStudyId = urlParams.get('STUDY_ID');
const prolificSessionId = urlParams.get('SESSION_ID'); 

// Helper to randomly sample N unique indices from an array length
function getRandomIndices(max: number, count: number): number[] {
    const indices: number[] = [];
    while (indices.length < count && indices.length < max) {
        const rand = Math.floor(Math.random() * max);
        if (!indices.includes(rand)) {
            indices.push(rand);
        }
    }
    return indices;
}

// Helper for saving json result for local save
function downloadJson(data: object, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: filename });
  a.click();
  URL.revokeObjectURL(a.href);
}

export function initExperiment() {
  const participantId =
    urlParams.get("PROLIFIC_PID") ??
    urlParams.get("pid") ??
    crypto.randomUUID();
  
  // ==========================================================
  // PARTITION TRIALS: 3 Random Practice Trials vs Main Trials
  // ==========================================================
  const practiceIndices = getRandomIndices(stimuli.length, 2);
  const mainStimuli = stimuli.filter((_, index) => !practiceIndices.includes(index));

  const compactResults = (rows: any[]) =>
    rows
      // --- ADDED FILTER HERE ---
      // Excludes any rows that belong to the comprehension check task
      .filter((row) =>
        row?.task !== "comprehension_check" &&
        row?.task !== "antiphase_headphone_check"&&
        row?.task !== "experiment_instructions"&&
        row?.task !== "study_overview" &&
        row?.task !== "start_experiment_screen" &&
        row?.task !== "start_practice_screen" &&
        row?.task !== "consent_screen" &&
        row?.task !== "consent_screen" &&
        row?.task !== "part_transition_screen" &&
        row?.task !== "debrief_screen" &&
        row?.task !== "delay" &&
        row?.task !== "volume_check_intro" &&
        row?.task !== "volume_check_playback" &&
        row?.task !== "hc_example"

      )
      .map((row) => {
      const {
        stimulus,
        stimulus_html,
        button_html,
        html,
        choices,
        prompt,
        pages,
        timeline,
        preload,
        display_element,
        plugin_version, 
        trial_type,
        ...kept
      } = row ?? {};

      return kept;
    });

  document.body.classList.add("experiment-progress-hidden");

  // Use mainStimuli length for the true experiment trial count
  const actualTrialCount = mainStimuli.length;
  let completedActualTrials = 0;
  let mainExperimentStarted = false;

  const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    
    message_progress_bar: () => {
      return `<span class="experiment-progress-label">Progress:  <strong>${completedActualTrials}/${actualTrialCount}</strong> trials</span>`;
    },
    
    auto_preload: false,
    use_webaudio: false,
    override_safe_mode: true,

    on_trial_start: (trial: any) => {
      if (trial?.data?.task === "gold_msi" || trial?.data?.task === "gold_msi_mixed" || trial?.data?.task === "gold_msi_sliders") {
        document.body.classList.remove("experiment-progress-visible");
        document.body.classList.add("experiment-progress-hidden");
        return;
      }

      // Explicitly hide during practice or before the main experiment starts
      if (!mainExperimentStarted || trial?.data?.phase === "practice") {
        document.body.classList.remove("experiment-progress-visible");
        document.body.classList.add("experiment-progress-hidden");
        return;
      }

      document.body.classList.remove("experiment-progress-hidden");
      document.body.classList.add("experiment-progress-visible");
    },

    on_trial_finish: (data: any) => {
      if (data?.task === "start_experiment_screen") {
        mainExperimentStarted = true;
        completedActualTrials = 0;

        if (jsPsych.progressBar) {
          jsPsych.progressBar.progress = 0;
        }
        return;
      }

      if (mainExperimentStarted && data?.phase !== "practice" && data?.task !== "gold_msi" && data?.task !=="demographics") {
        completedActualTrials += 1;

        if (jsPsych.progressBar) {
          jsPsych.progressBar.progress = Math.min(completedActualTrials / actualTrialCount, 1);
        }
      }
    },

    on_finish: async (data: any) => {
      // Save compact, analysis-ready results together with session metadata.
      const results = JSON.parse(data.json());
      const payload = {
        participantId,
        startedAt: jsPsych.getStartTime?.() ?? null,
        completedAt: new Date().toISOString(),
        sessionSource: isProlific ? 'prolific' : 'pilot',
        prolific_study_id: prolificStudyId,
        prolific_session_id: prolificSessionId,
        results: Array.isArray(results) ? compactResults(results) : results
      };

      // --- FOR LOCAL DEV DOWNLOADS ---
      downloadJson(payload, `participant_${participantId}.json`);

      const res = await fetch("./api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to save data safely:", await res.text());
      }
    },
  });
  

  const timeline = [];

  // timeline.push(consent);
  // timeline.push(overview);

  // const headphoneCheck = createHeadphoneCheck(jsPsych, { trialCount: 6, passMark: 6 });
  // timeline.push(...headphoneCheck);

  timeline.push({
    timeline: [
      getInstructions(), 
      ...buildComprehensionTimeline(jsPsych)
    ],
    loop_function: (data: any) => {
      const checkData = data.filter({ task: "comprehension_check" }).values();
      const playCountSelection = checkData[0]?.response;
      const classificationSelection = checkData[1]?.response;
      const passed = playCountSelection === "As many times as I need" && classificationSelection === "Pick the option that belongs to the training group";
      if (!passed) { alert("One or more answers were incorrect. Please review instructions."); }
      return !passed;
    }
  });

  // timeline.push(startPracticeTrials());
  // timeline.push(getPracticeTimeline(jsPsych, practiceIndices));


  // timeline.push({
  //   ...startExperiment(),
  //   on_finish: () => {
  //     document.body.classList.remove("state-instructions");
  //     document.body.classList.remove("in-practice-phase");
  //     document.body.classList.add("experiment-progress-hidden");
  //   }
  // });

  // Build and deploy the counterbalanced blocks timeline
  const experimentalBlocks = buildBlockTimeline(jsPsych, mainStimuli);
  timeline.push(...experimentalBlocks);

  // timeline.push(transition);
  // timeline.push(...buildGoldMSITimeline());
  // timeline.push(...buildDemographicsTimeline(),)
  // timeline.push(debrief);

  jsPsych.run(timeline);
}

initExperiment();