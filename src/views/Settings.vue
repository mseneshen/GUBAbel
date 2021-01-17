<template>
  <div>
    <WindowFrame />
    <v-form class="form" ref="form" v-model="valid" lazy-validation>
      <v-select
        required
        label="Input Language"
        :items="languages"
        v-model="settings.inputLanguage"
      ></v-select>
      <v-select
        required
        label="Output Language"
        :items="languages"
        v-model="settings.outputLanguage"
      ></v-select>
      <v-text-field
        required
        label="Font Family"
        v-model="settings.fontFamily"
      ></v-text-field>
      <v-slider
        required
        :hint="settings.fontSize"
        min="6"
        max="80"
        label="Font Size"
        persistent-hint
        v-model="settings.fontSize"
      ></v-slider>
    </v-form>
  </div>
</template>

<style>
.form {
  padding: 16px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer, remote } from "electron";
import WindowFrame from "@/components/WindowFrame.vue";

const preferences = ipcRenderer.sendSync("getPreferences");

export default Vue.extend({
  name: "Settings",
  components: {
    WindowFrame
  },
  data: () => ({
    languages: [
      "Chinese, Mandarin (Simplified, China)\tzh (cmn-Hans-CN)",
      "Chinese, Mandarin (Traditional, Taiwan)\tzh-TW (cmn-Hant-TW)",
      "Czech (Czech Republic)\tcs-CZ",
      "Danish (Denmark)\tda-DK",
      "English (Australia)\ten-AU",
      "English (India)\ten-IN",
      "English (Singapore)\ten-SG",
      "English (United Kingdom)\ten-GB",
      "English (United States)\ten-US",
      "Finnish (Finland)\tfi-FI",
      "French (France)\tfr-FR",
      "German (Germany)\tde-DE",
      "Hindi (India)\thi-IN",
      "Indonesian (Indonesia)\tid-ID",
      "Italian (Italy)\tit-IT",
      "Japanese (Japan)\tja-JP",
      "Korean (South Korea)\tko-KR",
      "Spanish (United States)\tes-US",
      "Swedish (Sweden)\tsv-SE",
      "Turkish (Turkey)\ttr-TR"
    ]
  }),
  computed: {
    settings() {
      return this.$store.state;
    }
  }
});
</script>
