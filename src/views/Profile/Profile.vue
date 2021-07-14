<template>
  <router-link
    :to="{
      name: 'Daily',
      params: {
        membershipType: profile.membershipType,
        membershipId: profile.membershipId
      }
    }"
    >Daily report</router-link
  >

  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import useProfile from '~/composables/useProfile';

export default defineComponent({
  setup() {
    return { profile: useProfile() };
  }
});
</script>
