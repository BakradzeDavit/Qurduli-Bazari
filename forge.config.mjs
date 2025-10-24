import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyPreload() {
  const src = path.join(__dirname, "src/preload.cjs");
  const dest = path.join(__dirname, "out/preload.cjs");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("✓ Copied preload.cjs");
}

export default {
  packagerConfig: {
    asar: true,
    name: "Qurduli Bazari",
    executableName: "qurduli-bazari",
    extraResources: [
      {
        from: "ServiceAccountKey.json",
        to: "./ServiceAccountKey.json", // Fixed path
      },
      {
        from: "out/preload.cjs", // Use the copied file
        to: "./preload.cjs", // Fixed path
      },
    ],
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: { name: "qurduli_bazari" },
    },
    { name: "@electron-forge/maker-zip", platforms: ["darwin"] },
    { name: "@electron-forge/maker-deb", config: {} },
    { name: "@electron-forge/maker-rpm", config: {} },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-vite",
      config: {
        build: [
          {
            entry: "src/main.cjs",
            config: "vite.main.config.mjs",
          },
        ],
        renderer: [
          {
            name: "main_window",
            config: "vite.renderer.config.mjs",
          },
        ],
      },
    },
  ],
  hooks: {
    prePackage: copyPreload,
  },
};