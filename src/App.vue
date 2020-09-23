<template>
  <Nav />
  <router-view />
</template>

<script lang="ts">
import Nav from '@/components/Nav.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { Nav }
});
</script>

<style lang="scss" src="./App.scss"></style>
