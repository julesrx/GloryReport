<template>
  <div class="flex flex-col w-14 text-right">
    <MutedText class="text-sm">{{ name }}</MutedText>
    <span class="text-lg">{{ value }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MutedText from 'components/common/MutedText.vue';

export default defineComponent({
  props: {
    name: { type: String, required: true },
    value: { type: [String, Number] }
  },
  components: { MutedText }
});
</script>
