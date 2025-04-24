import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

// Manually load the .env file
dotenv.config();

console.log("SSL Key Path:", process.env.VITE_SSL_KEY_PATH);
console.log("SSL Cert Path:", process.env.VITE_SSL_CERT_PATH);

// Access the environment variables with the VITE_ prefix
const keyPath = process.env.VITE_SSL_KEY_PATH;
const certPath = process.env.VITE_SSL_CERT_PATH;

if (!keyPath || !certPath) {
  throw new Error(
    "SSL key or cert path is not defined in the environment variables."
  );
}
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
