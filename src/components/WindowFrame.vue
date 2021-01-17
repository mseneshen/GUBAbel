<template>
  <div class="frame">
    <p class="text-h6 text-center">Settings</p>
    <button dark large v-on:click="close" class="close-btn">
      <v-icon>mdi-close</v-icon>
    </button>
  </div>
</template>

<style>
body {
  -webkit-app-region: no-drag;
}

.frame {
  display: block;
  width: 100%;
  height: 32px;
  background: #fff1;
  -webkit-app-region: drag !important;
}

.close-btn {
  display: block;
  height: 32px;
  width: 32px;
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px;
  -webkit-app-region: no-drag;
}

.close-btn:hover {
  background-color: #f001;
}

.close-btn:active {
  background-color: #f00a;
}
</style>

<script lang="ts">
import Vue from "vue";
const remote = require("electron").remote;

export default Vue.extend({
  name: "WindowFrame",
  methods: {
    close: () => {
      remote.getCurrentWindow().close();
    }
  }
});
</script>
