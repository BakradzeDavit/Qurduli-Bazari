import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  packagerConfig: {
    asar: false,
    name: "Qurduli Bazari",
    executableName: "qurduli-bazari",
    extraResource: [
      "ServiceAccountKey.json",
      "src/preload.cjs"
    ],
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: { 
        name: "qurduli_bazari" 
      },
    },
    { 
      name: "@electron-forge/maker-zip", 
      platforms: ["darwin"] 
    },
    { 
      name: "@electron-forge/maker-deb", 
      config: {} 
    },
    { 
      name: "@electron-forge/maker-rpm", 
      config: {} 
    },
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
    postPackage: async (forgeConfig, options) => {
      console.log('Copying node_modules...');
      const appPath = path.join(options.outputPaths[0], 'resources', 'app');
      const nodeModulesSource = path.join(__dirname, 'node_modules');
      const nodeModulesDest = path.join(appPath, 'node_modules');
      
      await fs.copy(nodeModulesSource, nodeModulesDest);
      console.log('✓ node_modules copied successfully');
    }
  }
};