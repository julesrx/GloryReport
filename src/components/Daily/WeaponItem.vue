<template>
  <div
    :style="{ backgroundImage: `url(${icon})` }"
    :class="['bg-contain bg-center bg-no-repeat relative']"
    :title="name"
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
      >{{ weapon.uniqueWeaponKills }} ({{ precision }}%)</span
    >
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, onMounted, PropType } from 'vue';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

import { DayReportResultWeapon } from '~/interfaces';
import { getDefinition } from '~/manifest';

export default defineComponent({
  props: {
    weapon: { type: Object as PropType<DayReportResultWeapon>, required: true }
  },
  setup(props) {
    const def = ref<DestinyInventoryItemDefinition | null>(null);
    onMounted(async () => {
      if (!props.weapon.referenceId) return;
      def.value = await getDefinition(props.weapon.referenceId);
    });

    const icon = computed(() =>
      def.value ? `https://www.bungie.net${def.value.displayProperties.icon}` : undefined
    );
    const name = computed(() => def.value?.displayProperties.name);

    const precision = computed(() =>
      Math.round((props.weapon.uniqueWeaponPrecisionKills / props.weapon.uniqueWeaponKills) * 100)
    );

    return { icon, name, precision };
  }
});
</script>
