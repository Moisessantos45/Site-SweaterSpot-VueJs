<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps({
  to: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <RouterLink
    :to="{ name: to }"
    class="rounded bg-green-400 hover:bg-green-500 font-bold lg:px-10 px-5 py-2"
  >
    <slot />
  </RouterLink>
</template>
