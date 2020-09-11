<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/logo.png" />
    <p>This is home</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>
