<template>
  <div>
    <v-icon dark class="move-btn">mdi-cursor-move</v-icon>
    <p :style="cssVars" class="text-custom text-center">{{ liveCaption }}</p>
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
  cursor: move !important;
}

.text-custom {
  font-size: var(--text-size) !important;
  font-family: var(--font-family) !important;
}
</style>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";

export default Vue.extend({
  name: "Captions",
  mounted() {
    ipcRenderer.on("transcript", (event, transcript) => {
      console.log(`new transcript: ${transcript}`);
      this.liveCaption = transcript;
    });
    ipcRenderer.on("vuexUpdate", (event, mutation) => {
      this.$store.IS_CAPTION_WINDOW = true;
      this.$store.commit(mutation.type, mutation.payload);
    });
  },
  data: () => ({
    liveCaption: "haha text goes brrrrrr"
  }),
  computed: {
    cssVars() {
      return {
        "--text-size": this.$store.state.fontSize + "pt",
        "--font-family": this.$store.state.fontFamily
      };
    }
  },
  beforeDestroy() {
    this.unsubscribe();
  }
});
</script>
