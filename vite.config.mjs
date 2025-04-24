import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import path from "node:path";

const keyPath = "/Users/liorlavon/igenie-chatbot/ssl/server.key";
const certPath = "/Users/liorlavon/igenie-chatbot/ssl/server.crt";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   host: "0.0.0.0",
  //   https: false,
  // },
  server: {
    https: {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    },
    host: true, // allows access via your Azure VM IP
    port: 3000,
  },
});
