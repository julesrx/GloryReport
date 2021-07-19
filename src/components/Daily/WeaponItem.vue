<template>
  <div>
    <DestinyInventoryItem :reference-id="weapon.referenceId" :class="imgClass" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { DayReportResultWeapon } from '~/interfaces';
import DestinyInventoryItem from 'components/common/DestinyInventoryItem.vue';

export default defineComponent({
  components: { DestinyInventoryItem },
  props: {
    weapon: { type: Object as PropType<DayReportResultWeapon>, required: true },
    imgClass: { type: Array, default: () => ['h-20', 'w-20'] }
  }
});
</script>
