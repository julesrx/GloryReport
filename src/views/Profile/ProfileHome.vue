<template>
  <h1>Profile</h1>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';

import useProfile from '~/composables/useProfile';

export default defineComponent({
  setup() {
    const profile = useProfile();

    watch(
      () => profile.profile,
      profile => {
        if (!profile) return;

        console.log(profile);
      },
      { immediate: true }
    );
  }
});
</script>
