<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import useProfile from '~/composables/useProfile';

export default defineComponent({
  setup() {
    return { profile: useProfile(useRoute()) };
  }
});
</script>
