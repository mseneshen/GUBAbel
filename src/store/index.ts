import Vue from "vue";
import Vuex from "vuex";
import { ipcRenderer } from "electron";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: ipcRenderer.sendSync("getPreferences"),
  mutations: {
    setInputLanguage(state, lang) {
      state.inputLanguage = lang;
      ipcRenderer.sendSync("setPreferences", state);
    },
    setOutputLanguage(state, lang) {
      state.outputLanguage = lang;
      ipcRenderer.sendSync("setPreferences", state);
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
  modules: {}
});

export default store;
