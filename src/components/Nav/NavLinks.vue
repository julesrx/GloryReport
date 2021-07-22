<template>
  <div class="flex justify-center space-x-3">
    <NavLink name="Encounters" :params="routeParams">Encounters</NavLink>
    <NavLink name="Daily" :params="routeParams">Daily</NavLink>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

import NavLink from './NavLink.vue';
import { ProfileState } from '~/interfaces';

export default defineComponent({
  props: {
    profile: { type: Object as PropType<ProfileState>, required: true }
  },
  components: { NavLink },
  setup(props) {
    const routeParams = computed(() => ({
      membershipType: props.profile.membershipType,
      membershipId: props.profile.membershipId
    }));

    return { routeParams };
  }
});
</script>
