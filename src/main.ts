import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import "./assets/style.css";

import { consent } from "./trial/consent"; 
import { overview } from "./trial/overview.ts";
import { getPracticeTrials } from "./trial/practiceTrials.ts"
import { createHeadphoneCheck } from "./trial/headphoneCheck"
import { getInstructions } from "./trial/instructions";
import { buildComprehensionTimeline } from "./trial/comprehensionCheck";
import { startPracticeTrials } from "./trial/startPracticeTrials.ts";
import { startExperiment } from "./trial/startExperiment.ts";

import { buildBlockTimeline } from "./trial/blockBuilder.ts"
import { stimuli } from "./utils/stimuli";
import { transition } from "./trial/transition";
import { buildGoldMSITimeline } from "./trial/goldMSI";
import { buildDemographicsTimeline } from "./trial/demographics"; // Adjust path to where your file is located
import { debrief } from "./trial/debrief";

const urlParams = new URLSearchParams(window.location.search);
const isProlific = urlParams.has('PROLIFIC_PID');
const prolificStudyId = urlParams.get('STUDY_ID');
const prolificSessionId = urlParams.get('SESSION_ID'); 

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

  const actualTrialCount = stimuli ? stimuli.length : 0;
  let completedActualTrials = 0;
  let progressValueElement: HTMLSpanElement | null = null;
  let mainExperimentStarted = false;

  const updateProgressValue = () => {
    if (progressValueElement) {
      progressValueElement.textContent = `${completedActualTrials}/${actualTrialCount} trials`;
    }
  };

  const ensureProgressValueElement = () => {
    const progressContainer = document.getElementById("jspsych-progressbar-container");
    if (!progressContainer) return;

    progressValueElement = progressContainer.querySelector<HTMLSpanElement>(
      ".experiment-progress-value"
    );

    if (!progressValueElement) {
      progressValueElement = document.createElement("span");
      progressValueElement.className = "experiment-progress-value";
      progressContainer.appendChild(progressValueElement);
    }

    updateProgressValue();
  };

  const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    message_progress_bar: () => `<span class="experiment-progress-label">Progress</span>`,

    auto_preload: false,
    use_webaudio: false,
    override_safe_mode: true,

    on_trial_start: (trial: any) => {
      const task = trial?.data?.task;


    // Reveal ONLY during actual main experiment classification trials
    if (task === "classification" && !document.body.classList.contains("in-practice-phase")) {
      document.body.classList.remove("experiment-progress-hidden");
      document.body.classList.add("experiment-progress-visible");
      ensureProgressValueElement();
    } else {
      document.body.classList.remove("experiment-progress-visible");
      document.body.classList.add("experiment-progress-hidden");
    }
  },

    on_trial_finish: (data: any) => {
      if (data?.task === "start_experiment_screen") {
        mainExperimentStarted = true;
        completedActualTrials = 0;

        if (jsPsych.progressBar) {
          jsPsych.progressBar.progress = 0;
        }

        updateProgressValue();
        return;
      }

      if (data?.task !== "classification") {
        return;
      }

      completedActualTrials += 1;

      if (jsPsych.progressBar) {
        jsPsych.progressBar.progress = Math.min(completedActualTrials / actualTrialCount, 1);
      }

      updateProgressValue();
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

  timeline.push(consent);
  timeline.push(overview);

  const headphoneCheck = createHeadphoneCheck(jsPsych, { trialCount: 6, passMark: 6 });
  timeline.push(...headphoneCheck);

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

  timeline.push(startPracticeTrials());
  timeline.push({
    timeline:[
    ...getPracticeTrials(jsPsych)]
  });


  timeline.push({
    ...startExperiment(),
    on_finish: () => {
      document.body.classList.remove("state-instructions");
      document.body.classList.remove("in-practice-phase");
      document.body.classList.add("experiment-progress-hidden");
    }
  });

  // Build and deploy the counterbalanced blocks timeline
  const experimentalBlocks = buildBlockTimeline(jsPsych, stimuli, participantId);
  timeline.push(...experimentalBlocks);

  timeline.push(transition);
  timeline.push(...buildGoldMSITimeline());
  timeline.push(...buildDemographicsTimeline(),)
  timeline.push(debrief);

  jsPsych.run(timeline);
}

initExperiment();