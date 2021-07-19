<template>
  <img :src="icon" :title="name" />

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
