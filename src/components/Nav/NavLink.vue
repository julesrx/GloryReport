<template>
  <router-link :to="to" :class="{ 'opacity-50': !isActive, 'hover:(underline opacity-100)': true }">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  props: {
    name: { type: String, required: true },
    params: { type: Object, required: true }
  },
  setup(props) {
    const to = computed(() => ({ name: props.name, params: props.params }));

    const route = useRoute();
    const isActive = computed(() => route.matched.some(m => m.name === props.name));

    return { to, isActive };
  }
});
</script>
