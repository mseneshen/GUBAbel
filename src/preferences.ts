import path from "path";
import { app } from "electron";
import os from "os";
import ElectronPreferences from "electron-preferences";

console.log(app.getPath("userData"));

export default new ElectronPreferences({
  /**
   * Where should preferences be saved?
   */
  dataStore: path.resolve(app.getPath("userData"), "preferences.json"),
  /**
   * Default values.
   */
  defaults: {
    inputLanguage: "en-US",
    outputLanguage: "fr-FR",
    fontSize: 12,
    fontFamily: "Helvetica",
    defaultDimensionsWidth: 800,
    defaultDimensionsHeight: 100
  },
  /**
   * If the `onLoad` method is specified, this function will be called immediately after
   * preferences are loaded for the first time. The return value of this method will be stored as the
   * preferences object.
   */
  onLoad: (preferences: object) => {
    // ...
    return preferences;
  }
});
