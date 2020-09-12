<template>
  <div id="app">
    <Nav />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Nav from '@/components/Nav.vue';

@Component({
  components: {
    Nav
  }
})
export default class App extends Vue {}
</script>

<style lang="scss" src="./App.scss"></style>
