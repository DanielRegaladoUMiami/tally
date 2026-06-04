/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // served from https://danielregaladoumiami.github.io/tally/
  base: "/tally/",
  plugins: [react()],
  server: { host: "127.0.0.1", port: 5173 },
  build: {
    rollupOptions: {
      input: {
        main: "index.html", // the landing / waitlist  →  /
        app: "app.html", // the product prototype     →  /app.html
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    restoreMocks: true,
  },
});
