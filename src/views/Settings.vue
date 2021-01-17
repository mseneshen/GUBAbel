<template>
  <div>
    <WindowFrame />
    <p class="text-h4 text-center">{{ liveCaption }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import WindowFrame from "@/components/WindowFrame.vue";

export default Vue.extend({
  name: "Settings",
  components: {
    WindowFrame
  },
  data: () => ({
    liveCaption: "settings get yeeted here"
  })
});
</script>
