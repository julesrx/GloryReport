<template>
  <div class="mt-60 space-y-4">
    <AppLogo />
    <PlayerSearch />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppLogo from 'components/AppLogo.vue';
import PlayerSearch from 'components/Nav/PlayerSearch.vue';
import { useSetTitle } from '~/composables/useSetTitle';

export default defineComponent({
  components: { AppLogo, PlayerSearch },
  setup() {
    const setTitle = useSetTitle();
    setTitle();
  }
});
</script>
