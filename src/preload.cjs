const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAllUsers: () => ipcRenderer.invoke("get-all-users"),
  getUserInfo: (uid) => ipcRenderer.invoke("getUserInfo", uid),
  updateUsername: (uid, newUsername) =>
    ipcRenderer.invoke("update-username", { uid, newUsername }),
  uploadProfilePicture: (uid, fileData) =>
    ipcRenderer.invoke("upload-profile-picture", uid, fileData),
});

console.log("✓ Preload script loaded successfully");
