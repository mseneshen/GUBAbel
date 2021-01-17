<template>
  <div>
    <WindowFrame />
    <v-form class="form" ref="form" lazy-validation>
      <v-select
        required
        label="Input Language"
        :items="inLanguages"
        item-text="text"
        item-value="val"
        v-model="inputLang"
      ></v-select>
      <v-select
        required
        label="Output Language"
        :items="outLanguages"
        item-text="text"
        item-value="val"
        v-model="outputLang"
      ></v-select>
      <v-text-field
        required
        label="Font Family"
        v-model="settings.fontFamily"
        @change="updateFontFamily"
      ></v-text-field>
      <v-slider
        required
        :hint="String(settings.fontSize)"
        min="6"
        max="80"
        label="Font Size"
        persistent-hint
        v-model="settings.fontSize"
        @change="updateFontSize"
      ></v-slider>
      <v-slider
        required
        :hint="String(settings.defaultDimensionsWidth)"
        min="60"
        max="2160"
        step="20"
        label="Default Caption Width"
        persistent-hint
        v-model="settings.defaultDimensionsWidth"
        @change="updateWidth"
      ></v-slider>
      <v-slider
        required
        :hint="String(settings.defaultDimensionsHeight)"
        min="20"
        max="200"
        step="10"
        label="Default Caption Height"
        persistent-hint
        v-model="settings.defaultDimensionsHeight"
        @change="updateHeight"
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

export default Vue.extend({
  name: "Settings",
  components: {
    WindowFrame
  },
  data: () => ({
    inLanguages: [
      {
        text: "Chinese, Mandarin (Simplified, China)",
        val: "zh (cmn-Hans-CN)"
      },
      {
        text: "Chinese, Mandarin (Traditional, Taiwan)",
        val: "zh-TW (cmn-Hant-TW)"
      },
      { text: "Czech (Czech Republic)", val: "cs-CZ" },
      { text: "Danish (Denmark)", val: "da-DK" },
      { text: "English (Australia)", val: "en-AU" },
      { text: "English (India)", val: "en-IN" },
      { text: "English (Singapore)", val: "en-SG" },
      { text: "English (United Kingdom)", val: "en-GB" },
      { text: "English (United States)", val: "en-US" },
      { text: "Finnish (Finland)", val: "fi-FI" },
      { text: "French (France)", val: "fr-FR" },
      { text: "German (Germany)", val: "de-DE" },
      { text: "Hindi (India)", val: "hi-IN" },
      { text: "Indonesian (Indonesia)", val: "id-ID" },
      { text: "Italian (Italy)", val: "it-IT" },
      { text: "Japanese (Japan)", val: "ja-JP" },
      { text: "Korean (South Korea)", val: "ko-KR" },
      { text: "Spanish (United States)", val: "es-US" },
      { text: "Swedish (Sweden)", val: "sv-SE" },
      { text: "Turkish (Turkey)", val: "tr-TR" }
    ],
    outLanguages: [
      {
        text: "Chinese, Mandarin (Simplified, China)",
        val: "zh"
      },
      {
        text: "Chinese, Mandarin (Traditional, Taiwan)",
        val: "zh-TW"
      },
      { text: "Czech (Czech Republic)", val: "cs-CZ" },
      { text: "Danish (Denmark)", val: "da-DK" },
      { text: "English (Australia)", val: "en-AU" },
      { text: "English (India)", val: "en-IN" },
      { text: "English (Singapore)", val: "en-SG" },
      { text: "English (United Kingdom)", val: "en-GB" },
      { text: "English (United States)", val: "en-US" },
      { text: "Finnish (Finland)", val: "fi-FI" },
      { text: "French (France)", val: "fr-FR" },
      { text: "German (Germany)", val: "de-DE" },
      { text: "Hindi (India)", val: "hi-IN" },
      { text: "Indonesian (Indonesia)", val: "id-ID" },
      { text: "Italian (Italy)", val: "it-IT" },
      { text: "Japanese (Japan)", val: "ja-JP" },
      { text: "Korean (South Korea)", val: "ko-KR" },
      { text: "Spanish (United States)", val: "es-US" },
      { text: "Swedish (Sweden)", val: "sv-SE" },
      { text: "Turkish (Turkey)", val: "tr-TR" }
    ]
  }),
  computed: {
    settings() {
      return this.$store.state;
    },
    inputLang: {
      // getter
      get: function() {
        return this.findLanguage(this.inLanguages, this.settings.inputLanguage);
      },
      // setter
      set: function(newVal) {
        this.$store.commit("setInputLanguage", newVal);
      }
    },
    outputLang: {
      // getter
      get: function() {
        return this.findLanguage(
          this.outLanguages,
          this.settings.outputLanguage
        );
      },
      // setter
      set: function(newVal) {
        this.$store.commit("setOutputLanguage", newVal.substring(0, 2));
      }
    }
  },
  methods: {
    findLanguage: (arr, val) => {
      for (const obj of arr) {
        if (obj.val === val) return obj;
      }
    },
    updateFontFamily: function() {
      this.$store.commit("setFontFamily", this.settings.fontFamily);
    },
    updateFontSize: function() {
      this.$store.commit("setFontSize", this.settings.fontSize);
    },
    updateWidth: function() {
      this.$store.commit("setWidth", this.settings.defaultDimensionsWidth);
    },
    updateHeight: function() {
      this.$store.commit("setHeight", this.settings.defaultDimensionsHeight);
    }
  }
});
</script>
