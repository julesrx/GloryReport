<template>
  <ul>
    <li>
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
    </li>
    <li>
      <router-link
        :to="{
          name: 'EncountersRecap',
          params: {
            membershipType: profile.membershipType,
            membershipId: profile.membershipId
          }
        }"
        >Encounters</router-link
      >
    </li>
  </ul>
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
