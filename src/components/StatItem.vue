<template>
  <div class="flex flex-col items-end w-12">
    <span class="text-xs">{{ title }}</span>
    <span>{{ value }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: String,
    value: String
  }
});
</script>
