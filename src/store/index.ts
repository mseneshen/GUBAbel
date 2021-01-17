import Vue from "vue";
import Vuex from "vuex";
import { ipcRenderer } from "electron";
const preferences = ipcRenderer.sendSync("getPreferences");

Vue.use(Vuex);

export default new Vuex.Store({
  state: preferences,
  mutations: {},
  actions: {},
  modules: {}
});
