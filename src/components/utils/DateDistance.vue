<template>
  <span :title="title">{{ distance }}</span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { formatDistanceToNow, format } from 'date-fns';

export default defineComponent({
  props: {
    date: {
      type: String,
      required: true
    },
    titleFormat: {
      type: String,
      default: 'dd/MM/yyyy HH:mm'
    }
  },
  setup(props) {
    const distance = ref(formatDistanceToNow(new Date(props.date), { addSuffix: true }));
    const title = ref(format(new Date(props.date), props.titleFormat));

    return { distance, title };
  }
});
</script>
