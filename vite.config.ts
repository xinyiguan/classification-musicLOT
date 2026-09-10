import { defineConfig } from "vite";

export default defineConfig({
    base: "/classification-musicLOT/",

    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            "/api": "http://localhost:3000", //<-- this proxy is used only duirng dev (npm run dev)
        },
    },

    build: {
        target: "es2020",
        sourcemap: true,
    },

    optimizeDeps: {
        include: [
            "jspsych",
            "@jspsych/plugin-html-button-response",
            "@jspsych/plugin-audio-button-response",
            "@jspsych/plugin-audio-keyboard-response",
            "@jspsych/plugin-external-html"
        ],
    },
});