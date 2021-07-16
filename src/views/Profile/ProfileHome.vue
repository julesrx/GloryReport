<template>
  <h1>Profile</h1>
  <NavLinks :profile="profile" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import useProfile from '~/composables/useProfile';
import NavLinks from 'components/Nav/NavLinks.vue';

export default defineComponent({
  components: { NavLinks },
  setup() {
    const profile = useProfile(useRoute());

    return { profile };
  }
});
</script>
