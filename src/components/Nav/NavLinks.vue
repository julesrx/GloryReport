<template>
  <div class="flex justify-center space-x-3">
    <NavLink name="Daily" :params="routeParams">Daily</NavLink>
    <NavLink name="EncountersRecap" :params="routeParams">Encounters</NavLink>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { DeepReadonly, UnwrapNestedRefs } from '@vue/reactivity';

import NavLink from './NavLink.vue';
import { ProfileState } from '~/interfaces';

export default defineComponent({
  props: {
    profile: {
      type: Object as PropType<DeepReadonly<UnwrapNestedRefs<ProfileState>>>,
      required: true
    }
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
