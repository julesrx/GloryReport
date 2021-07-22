<template>
  <tr class="hover:bg-dark-700 cursor-pointer" @click="navigateToEncounter(encounter)">
    <td :class="['text-center', showBorders ? cellBorder : null, cellSpacing]">
      {{ ranking }}
    </td>
    <td :class="[showBorders ? cellBorder : null, cellSpacing]">
      <div class="flex items-center">
        <EncounterIcon :encounter="encounter" />
        <span class="ml-2">{{ encounter.displayName }}</span>
      </div>
    </td>
    <td :class="['text-right', showBorders ? cellBorder : null, cellSpacing]">
      {{ encounter.count }}
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';

import { EncounterDisplay } from '~/interfaces/encounters';
import EncounterIcon from './EncounterIcon.vue';

export default defineComponent({
  components: {
    EncounterIcon
  },
  emits: ['select'],
  props: {
    encounter: { type: Object as PropType<EncounterDisplay>, required: true },
    ranking: { type: Number, required: true },
    showBorders: Boolean,
    cellBorder: String,
    cellSpacing: String
  },
  setup() {
    const router = useRouter();
    const navigateToEncounter = (encounter: EncounterDisplay) => {
      router.push({
        name: 'EncountersDetail',
        params: { selectedMembershipId: encounter.membershipId }
      });
    };

    return { navigateToEncounter };
  }
});
</script>
