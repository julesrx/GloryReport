<template>
  <teleport v-if="status.message" to="body">
    <footer class="fixed bottom-0 inset-x-0 bg-dark-700">
      <MutedText class="py-5 flex items-center justify-center">
        <svg
          v-if="status.isLoading"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p>{{ status.message }}</p>
      </MutedText>
    </footer>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { status } from '~/stores/manifest';
import MutedText from './common/MutedText.vue';

export default defineComponent({
  components: { MutedText },
  setup() {
    return { status };
  }
});
</script>
