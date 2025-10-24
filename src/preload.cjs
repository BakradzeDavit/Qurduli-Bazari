const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('backend', {
  getAllUsers: () => ipcRenderer.invoke('get-all-users')
});
