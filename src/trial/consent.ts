import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";

import epflLogoUrl from "../assets/logo-epfl.png";

export const consent = {
    type: jsPsychHtmlButtonResponse,

    stimulus: `
    <div id="instruction-page">

      <header id="school-header" aria-label="Institution">
        <img id="school-logo" src="${epflLogoUrl}" alt="EPFL" />
      </header>

      <!-- CONSENT BOX -->
      <div id="consent-box">

        <div id="consent-box-header">
          <h1>Participation in a music cognition experiment</h1>
        </div>

        <div id="consent-box-body" class="consent-text">
        <p>
            <b>Project title</b>:
            Investigating a language of thought in music (Classification)
          </p>

        <p>
            <b>Experimenter</b>:
            Xinyi GUAN
          </p>

          <p>
            <b>Contact</b>:
            <a href="mailto:xinyi.guan@epfl.ch">
              xinyi.guan@epfl.ch
            </a>
          </p>

          <p>
            <i>This study has been approved by the EPFL Research Ethics Committee (HREC No.: HREC000781 / 29.05.2026)</i>
          </p>

        <p>
          <b>Experiment Information </b><br>
          
          This study investigates how we mentally represent musical melodies. 
          It is part of the Swiss National Science Foundation (SNSF) project, “Investigating the perception of musical motifs” (Grant No. 218975).
          </p>

          <p>
          Anyone aged 18 or older with normal or corrected-to-normal hearing may participate in this study. 
          If you choose to participate, you will listen to short music excerpts and respond to questions (e.g., “which melody is the one you just memorized?”). 
          The session will take approximately 30-45 minutes. 
          Your participation is entirely voluntary. You are free to accept or refuse to participate in the study. 
          If you choose not to participate, or if you choose to change your mind during the course of the experiment, you may withdraw at any time by closing your browser window. 
          No data will be collected or stored in case of withdrawal. 
          </p>

          <p>
          There are no expected direct benefits or significant risks associated with participation. 
          Audio excerpts will be played at a moderate volume. 
          Your responses will be stored anonymously, with no link between the data and your identity, to minimize privacy risks. 
          The study may contribute to a better understanding of music perception and human cognition.
          </p>

          <p>
          <b>Protection of personal data </b><br>
          <u>Purpose of the data processing</u>. By law, EPFL may collect and use personal data for research purposes (art. 36c of the Federal Law on the Federal Institutes of Technology of 4 October 1991) 
          and we rely on this legal basis to legitimise our processing of personal data.
          </p>

          <p>
          <u>Data processed by Prolific</u>. Participants recruited through Prolific should be aware that Prolific acts as an independent data controller for the personal data collected through its platform. 
          The processing of personal data by Prolific, including account information and payment-related information, is governed by Prolific's own Privacy Notice and is separate from this research project. 
          We encourage you to review <a href="https://prolific.notion.site/Participant-Privacy-Notice-6b6cb4f60a674d96a1433bff6412215b?pvs=25"> Prolific's Participant Privacy Notice </a> before participating. 
          The research team receives only the information necessary to conduct the study and compensate participants and does not have access to participants' full Prolific accounts or payment information.
          </p>

          <p>
          <u>Security measures</u>. Your personal data will be encrypted or anonymised after collection. 
          It will be encrypted when used by researchers and will in principle be anonymised in any scientific publication (unless you have consented to publication of your personal data).
          </p>

          <p>
            <b>Informed Consent</b><br>
            By proceeding with the study, I agree to all of the following statements:
            <ol>
              <li>I declare that I have been informed in writing about the objectives and the course of the project, as well as the presumed effects, advantages, possible disadvantages and possible risks.</li>
              <li>I understand that my participation is voluntary, and I can withdraw at any time.</li>
              <li>I have been informed that all data will be collected, stored and reported safely in anonymous form, in accordance with the CH Federal law on data protection (art. 36c of the Federal Law on the Federal Institutes of Technology of 4 October 1991).</li>
              <li>I agree that the principal investigators have access to the original data under strict confidentiality.</li>
              <li>I allow my data to be used in future ethically approved research.</li>
            </ol>        
          </p>

        </div>
      </div>

      <!-- OUTSIDE THE BOX -->
      <div id="consent-controls">

        <label id="checkbox-container">
          <input type="checkbox" id="consent-checkbox" />
          <span>I wish to participate</span>
        </label>

      </div>

    </div>
  `,

    choices: ["Proceed to Experiment"],
    data: {
      task: "consent_screen"
    },


    on_load: () => {

        // document.body.classList.add("consent-active");
        document.body.classList.add("state-consent");
        const checkbox = document.getElementById("consent-checkbox") as HTMLInputElement;
        const button = document.querySelector(".jspsych-btn") as HTMLButtonElement;
        const controlsContainer = document.getElementById("consent-controls");

        if (button && controlsContainer) {
            controlsContainer.appendChild(button);
            button.disabled = true;
        }

        checkbox.addEventListener("change", () => {
            if (button) button.disabled = !checkbox.checked;
        });
    },
    on_finish: () => {
        document.body.classList.remove("state-consent");
    }
};

