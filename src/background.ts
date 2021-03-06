"use strict";
/* global __static */

import os from "os";
import path from "path";

import { app, protocol, BrowserWindow, Tray, Menu, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

// Preferences:
import preferences from "./preferences";

import {
  setInputLang,
  setOutputLang,
  setupBabelClient
} from "./babel_client.js";

const isDevelopment = process.env.NODE_ENV !== "production";
const iconPath = path.join(__static, "icons", "32x32.png");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

ipcMain.on("setInputLang", (event, arg) => {
  console.log("setting input lang to: ", arg);
  setInputLang(arg);
  event.reply("transcript", "Set input language to: " + arg);
});

ipcMain.on("setOutputLang", (event, arg) => {
  console.log("setting output lang to: ", arg);
  setOutputLang(arg);
  event.reply("transcript", "Set output language to: " + arg);
});

ipcMain.on("vuexMutation", (event, mutation) => {
  BrowserWindow.getAllWindows()[1].webContents.send("vuexUpdate", mutation);
});

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: preferences.value("defaultDimensionsWidth"),
    height: preferences.value("defaultDimensionsHeight"),
    frame: false,
    center: true,
    alwaysOnTop: true,
    webPreferences: {
      enableRemoteModule: true,
      devTools: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    },
    icon: iconPath
  });

  setupBabelClient(
    win,
    preferences.value("inputLanguage"),
    preferences.value("outputLanguage")
  );

  const rootUrl = process.env.WEBPACK_DEV_SERVER_URL as string;
  if (rootUrl) {
    // Load the url of the dev server if in development mode
    await win.loadURL(rootUrl);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

async function createTray() {
  const tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Toggle On/Off",
      type: "checkbox",
      checked: true
    },
    {
      label: "Settings",
      type: "normal",
      click: (menuItem, browserWindow, event) => {
        preferences.show();
      }
    },
    { type: "separator" },
    {
      label: "Quit",
      type: "normal",
      click: (menuItem, browserWindow, event) => {
        app.quit();
      }
    }
  ]);
  tray.setToolTip("GUBAbel");
  tray.setContextMenu(contextMenu);
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  // createTray();
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
