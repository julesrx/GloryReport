<template>
  <span :title="date">{{ distance }}</span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { formatDistanceToNow } from 'date-fns';

export default defineComponent({
  name: 'DateDistance',
  props: {
    date: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const distance = ref(formatDistanceToNow(new Date(props.date), { addSuffix: true }));

    return { distance };
  }
});
</script>