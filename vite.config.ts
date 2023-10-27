import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
    return {
        root: "./src/apps/playground/",
        base: command === "build"
            ? "/playground/"
            : "./",
        plugins: [
            react()
        ]
    };
});