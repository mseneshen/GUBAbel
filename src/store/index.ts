import Vue from "vue";
import Vuex from "vuex";
import { ipcRenderer } from "electron";
import { updater } from "@/plugins/vuexMutations.ts";
import { stat } from "fs";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: ipcRenderer.sendSync("getPreferences"),
  mutations: {
    setInputLanguage(state, lang) {
      state.inputLanguage = lang;
      ipcRenderer.sendSync("setPreferences", state);
      ipcRenderer.sendSync("setInputLang", lang);
    },
    setOutputLanguage(state, lang) {
      state.outputLanguage = lang;
      ipcRenderer.sendSync("setPreferences", state);
      ipcRenderer.sendSync("setOutputLang", lang);
    },
    setFontSize(state, size) {
      state.fontSize = size;
      ipcRenderer.sendSync("setPreferences", state);
    },
    setFontFamily(state, fam) {
      state.fontFamily = fam;
      ipcRenderer.sendSync("setPreferences", state);
    },
    setWidth(state, width) {
      state.defaultDimensionsWidth = width;
      ipcRenderer.sendSync("setPreferences", state);
    },
    setHeight(state, height) {
      state.defaultDimensionsHeight = height;
      ipcRenderer.sendSync("setPreferences", state);
    }
  },
  actions: {},
  modules: {},
  plugins: [updater]
});

export default store;
