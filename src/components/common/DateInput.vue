<template>
  <input
    type="date"
    class="placeholder-dark-50 bg-dark-500 py-1 pl-2 pr-8 rounded focus:outline-none"
    :value="value"
    @input="onInput"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { format } from 'date-fns';

export default defineComponent({
  props: { modelValue: { type: Date } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const value = computed(() => (props.modelValue ? format(props.modelValue, 'yyyy-MM-dd') : ''));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onInput = (e: any) =>
      emit('update:modelValue', e.target?.value ? new Date(e.target.value) : null);

    return { value, onInput };
  }
});
</script>
