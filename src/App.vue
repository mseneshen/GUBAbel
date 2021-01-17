<template>
  <v-app>
    <v-main>
      <Captions />
    </v-main>
  </v-app>
</template>

<style>
::-webkit-scrollbar {
  display: none;
}

body {
  -webkit-app-region: drag;
}
</style>

<script lang="ts">
import Vue from "vue";
import Captions from "./views/Captions.vue";

export default Vue.extend({
  name: "App",

  components: {
    Captions
  },

  data: () => ({
    //
  })
});
</script>
