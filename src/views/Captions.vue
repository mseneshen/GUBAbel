<template>
  <p class="text-h4 text-center">{{ liveCaption }}</p>
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
