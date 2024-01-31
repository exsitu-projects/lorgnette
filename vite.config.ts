import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({ command }) => {
    return {
        root: "./src/apps/playground/",

        base: command === "build"
            ? "/lorgnette/playground/"
            : "./",

        plugins: [
            react(),
            viteSingleFile()
        ],

        build: {
            outDir: "./build/",
            reportCompressedSize: false
        }
    };
});