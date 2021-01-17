<template>
  <v-container>
    <v-row class="text-center">
      <p class="caption">{{ liveCaption }}</p>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Captions",
  data: () => ({
    liveCaption: "haha text goes brrrrrr"
  })
});
</script>
