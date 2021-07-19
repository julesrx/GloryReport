<template>
  <Nav v-if="!isHome" />

  <main class="px-4 max-w-screen-xl mx-auto">
    <router-view />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import Nav from 'components/Nav/Nav.vue';

export default defineComponent({
  components: { Nav },
  setup() {
    const route = useRoute();
    const isHome = computed(() => route.matched.some(m => m.name === 'Home'));

    return { isHome };
  }
});
</script>
