<template>
  <div>
    <v-icon dark small class="move-btn">mdi-cursor-move</v-icon>
    <p class="text-h4 text-center">{{ liveCaption }}</p>
    <router-link
      class="settings-btn"
      :to="{ name: 'Settings' }"
      target="_blank"
    >
      <v-icon dark small>mdi-open-in-new</v-icon>
    </router-link>
  </div>
</template>

<style>
::-webkit-scrollbar {
  display: none;
}

.settings-btn {
  -webkit-app-region: no-drag;
  position: absolute;
  top: 5px;
  right: 10px;
  text-decoration: none;
}

.move-btn {
  -webkit-app-region: drag;
  position: absolute;
  top: 5px;
  left: 10px;
  text-decoration: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import {ipcRenderer} from "electron";

export default Vue.extend({
  name: "Captions",
  mounted(){
    ipcRenderer.on('transcript', (event, transcript) => {
      console.log(`new transcript: ${transcript}`);
      this.liveCaption = transcript;
    });
  },
  data: () => ({
    liveCaption: "haha text goes brrrrrr"
  })
});
</script>
