<template>
  <p v-if="!profile.profile">Loading profile...</p>
  <h2 v-else class="text-3xl font-bold">{{ profile.profile.userInfo.displayName }}</h2>

  <hr class="opacity-10 mt-2 mb-5" />

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
