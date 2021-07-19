<template>
  <!-- <img :src="icon" :title="name" /> -->
  <div
    :style="{ backgroundImage: `url(${icon})` }"
    class="bg-contain bg-center bg-no-repeat relative"
  >
    <span
      class="
        absolute
        bottom-0
        left-0
        m-0
        p-0
        bg-dark-800 bg-opacity-50
        text-light-100
        w-full
        h-4
        text-xs
        leading-none
        flex
        items-center
        pr-0.5
        justify-end
      "
      >36 (85%)</span
    >
  </div>
  <!-- <div>
    <img :src="icon" class="h-20 w-20" :title="name" />
    <p>{{ name }}</p>
  </div> -->
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

import { getDefinition } from '~/manifest';

export default defineComponent({
  props: {
    referenceId: { type: String, required: true }
  },
  setup(props) {
    const def = ref<DestinyInventoryItemDefinition | null>(null);

    onMounted(async () => {
      if (!props.referenceId) return;
      def.value = await getDefinition(props.referenceId);
    });

    return {
      def,
      icon: computed(() =>
        def.value ? `https://www.bungie.net${def.value.displayProperties.icon}` : undefined
      ),
      name: computed(() => def.value?.displayProperties.name)
    };
  }
});
</script>
