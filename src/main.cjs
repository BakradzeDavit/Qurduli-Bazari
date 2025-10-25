const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("node:path");
const fs = require("fs");
const admin = require("firebase-admin");

// ------------------- Debug Info -------------------
console.log("=== DEBUG INFO ===");
console.log("App path:", app.getAppPath());
console.log("Resources path:", process.resourcesPath);
console.log("CWD:", process.cwd());
console.log("__dirname:", __dirname);
console.log("App isPackaged:", app.isPackaged);
console.log("==================");

// ------------------- Error Handlers -------------------
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

// ------------------- Firebase Admin Setup -------------------
const getServiceAccountPath = () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "ServiceAccountKey.json");
  }
  return path.join(__dirname, "../../ServiceAccountKey.json");
};

let firebaseInitialized = false;

try {
  const serviceAccountPath = getServiceAccountPath();
  console.log("Looking for ServiceAccountKey at:", serviceAccountPath);
  console.log("File exists:", fs.existsSync(serviceAccountPath));

  if (!fs.existsSync(serviceAccountPath)) {
    console.error("ServiceAccountKey.json not found at:", serviceAccountPath);
    try {
      const dir = path.dirname(serviceAccountPath);
      console.log("Files in directory:", fs.readdirSync(dir));
    } catch (err) {
      console.error("Cannot read directory:", err);
    }
  } else {
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "dascord-aba66.firebasestorage.app",
    });
    firebaseInitialized = true;
    console.log("Firebase initialized successfully");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// ------------------- Create Main Window -------------------
const isDev = !app.isPackaged;

const createWindow = () => {
  try {
    const preloadPath = app.isPackaged
      ? path.join(process.resourcesPath, "preload.cjs")
      : path.join(__dirname, "../../src/preload.cjs");

    console.log("Preload path:", preloadPath);
    console.log("Preload exists:", fs.existsSync(preloadPath));

    const mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
      },
    });


    mainWindow.on("closed", () => {
      console.log("Main window closed");
    });

    mainWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription) => {
        console.error("Failed to load:", errorCode, errorDescription);
        // Show error page
        mainWindow.loadURL(
          "data:text/html,<h1>Failed to load app</h1><p>Error: " +
            errorDescription +
            "</p><p>Check console for details</p>"
        );
        mainWindow.webContents.openDevTools();
      }
    );

    if (isDev && typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== "undefined") {
      console.log("Loading dev server URL:", MAIN_WINDOW_VITE_DEV_SERVER_URL);
      mainWindow
        .loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
        .then(() => {
          mainWindow.webContents.openDevTools();
          console.log("Dev tools opened");
        })
        .catch((err) => console.error("Error loading dev URL:", err));
    } else {
      // Try multiple possible paths for the HTML file
      const possiblePaths = [
        path.join(__dirname, "../renderer/main_window/index.html"), // This should work now
        path.join(app.getAppPath(), ".vite/renderer/main_window/index.html"),
      ];

      console.log("Searching for index.html...");
      let indexHtmlPath = null;
      for (const testPath of possiblePaths) {
        console.log("Testing path:", testPath);
        console.log("Exists:", fs.existsSync(testPath));
        if (fs.existsSync(testPath)) {
          indexHtmlPath = testPath;
          console.log("✓ Found HTML at:", indexHtmlPath);
          break;
        }
      }

      if (!indexHtmlPath) {
        console.error("❌ HTML file not found!");
        console.error("Checked paths:", possiblePaths);

        // Show what files actually exist
        try {
          const appPath = app.getAppPath();
          console.log("\n=== Files in app directory ===");
          console.log("App path:", appPath);
          const files = fs.readdirSync(appPath, { recursive: true });
          files.forEach((file) => console.log("  -", file));
        } catch (e) {
          console.error("Cannot read app directory:", e);
        }

        // Load error page
        mainWindow.loadURL(
          "data:text/html,<h1>App files not found</h1><p>Check console logs (F12)</p>"
        );
        mainWindow.webContents.openDevTools();
        return;
      }

      console.log("Loading production HTML from:", indexHtmlPath);
      mainWindow
        .loadFile(indexHtmlPath)
        .then(() => console.log("✓ HTML loaded successfully"))
        .catch((err) => {
          console.error("Error loading production HTML:", err);
          mainWindow.loadURL(
            "data:text/html,<h1>Failed to load</h1><p>" + err.message + "</p>"
          );
          
        });
    }
  // Always open dev tools in packaged mode for debugging
    if (app.isPackaged) {
    
    }
  } catch (error) {
    console.error("Error creating window:", error);
  }
};

// ------------------- IPC Handlers -------------------
ipcMain.handle("get-all-users", async () => {
  if (!firebaseInitialized) return [];
  try {
    const result = await admin.auth().listUsers(100);
    return result.users.map((u) => ({ uid: u.uid, email: u.email }));
  } catch (err) {
    console.error("Error getting users:", err);
    return [];
  }
});

ipcMain.handle("getUserInfo", async (event, uid) => {
  if (!firebaseInitialized) return null;
  try {
    return (await admin.auth().getUser(uid)).toJSON();
  } catch (err) {
    console.error("Error getting user info:", err);
    return null;
  }
});

ipcMain.handle("update-username", async (event, { uid, newUsername }) => {
  if (!firebaseInitialized) return null;
  try {
    await admin.auth().updateUser(uid, { displayName: newUsername });
    return (await admin.auth().getUser(uid)).toJSON();
  } catch (err) {
    console.error("Error updating username:", err);
    return null;
  }
});

ipcMain.handle("upload-profile-picture", async (event, uid, fileData) => {
  if (!firebaseInitialized) return null;
  try {
    const bucket = admin.storage().bucket();
    const fileName = `profile-pictures/${uid}/${Date.now()}.jpg`;
    const file = bucket.file(fileName);
    const buffer = Buffer.from(fileData.split(",")[1], "base64");
    await file.save(buffer, { metadata: { contentType: "image/jpeg" } });
    await file.makePublic();
    const photoURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    await admin.auth().updateUser(uid, { photoURL });
    return photoURL;
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    return null;
  }
});

// ------------------- App Lifecycle -------------------
app
  .whenReady()
  .then(() => {
    console.log("App is ready");
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((err) => console.error("Error in app.whenReady:", err));

app.on("window-all-closed", () => {
  console.log("All windows closed");
  if (process.platform !== "darwin") app.quit();
});

console.log("Main process started");
