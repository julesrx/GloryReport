<template>
  <Nav />

  <main class="px-4 max-w-screen-xl mx-auto">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Nav from '@/components/Nav.vue';

export default defineComponent({
  components: { Nav }
});
</script>
