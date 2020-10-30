<template>
  <tr class="hover:bg-dark-600 cursor-pointer" @click="navigateToEncounter(encounter)">
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
import { defineComponent } from 'vue';

import { Encounter } from '@/models';
import EncounterIcon from '@/components/EncounterIcon.vue';

export default defineComponent({
  components: {
    EncounterIcon
  },
  emits: ['select'],
  props: {
    encounter: {
      type: Encounter,
      required: true
    },
    ranking: {
      type: Number,
      required: true
    },
    showBorders: Boolean,
    cellBorder: String,
    cellSpacing: String
  },
  methods: {
    navigateToEncounter(encounter: Encounter) {
      this.$router.push({
        name: 'ReportEncounter',
        params: { selectedMembershipId: encounter.membershipId }
      });
    }
  }
});
</script>
