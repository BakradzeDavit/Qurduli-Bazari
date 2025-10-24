const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("fs");
const admin = require("firebase-admin");

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../ServiceAccountKey.json"), "utf8")
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });
  ipcMain.handle("getUserInfo", async (event, uid) => {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord.toJSON();
    } catch (err) {
      console.error("Error fetching user info:", err);
      return null;
    }
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    const rendererPath = path.join(
      __dirname,
      "../.vite/build/renderer/index.html"
    );
    mainWindow.loadFile(rendererPath).catch((err) => {
      console.error("Failed to load renderer HTML:", err);
    });
  }

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

// IPC: send all Firebase Auth users
ipcMain.handle("get-all-users", async () => {
  try {
    const result = await admin.auth().listUsers(100);
    return result.users.map((u) => ({ uid: u.uid, email: u.email }));
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
});

ipcMain.handle("update-username", async (event, { uid, newUsername }) => {
  try {
    await admin.auth().updateUser(uid, { displayName: newUsername });
    const updatedUser = await admin.auth().getUser(uid);
    return updatedUser.toJSON();
  } catch (error) {
    console.error("Failed to update username:", error);
    return null;
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
