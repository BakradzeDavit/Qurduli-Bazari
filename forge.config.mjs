export default {
  packagerConfig: { asar: true },
  rebuildConfig: {},
  makers: [
    { name: '@electron-forge/maker-zip', platforms: ['win32'] }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          { entry: 'src/main.cjs', config: 'vite.main.config.mjs' },
          { entry: 'src/preload.cjs', config: 'vite.preload.config.mjs' }
        ],
        renderer: [
          { name: 'main_window', config: 'vite.renderer.config.mjs' }
        ]
      }
    }
  ]
};