<template>
  <table class="table-fixed w-full mt-4">
    <thead class="text-light-800">
      <tr>
        <td :class="['w-16 text-center', cellBorder, cellSpacing]">#</td>
        <td :class="[cellBorder, cellSpacing]">
          <div class="relative">
            <input
              type="search"
              v-model="search"
              class="ml-2 bg-transparent focus:outline-none placeholder-light-900 w-full pl-6"
              placeholder="Search..."
            />
          </div>
        </td>
        <td :class="['w-32 text-right', cellBorder, cellSpacing]">Matches</td>
      </tr>
    </thead>

    <tbody>
      <EncounterRow
        v-for="(enc, i) in slicedEncounters"
        :key="enc.membershipId"
        :encounter="enc"
        :ranking="getEncounterRanking(enc)"
        :showBorders="i < slicedEncounters.length - 1"
        :cellBorder="cellBorder"
        :cellSpacing="cellSpacing"
      />
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { throttle } from 'lodash-es';

import EncounterRow from 'components/Encounters/EncounterRow.vue';
import encounters from '~/stores/encounters';
import { Encounter, EncounterDisplay } from '~/interfaces/encounters';

export default defineComponent({
  components: { EncounterRow },
  setup() {
    // sorting
    const sortedEncounters = ref<EncounterDisplay[]>([]);
    const sortEncounters = () => {
      const res = encounters.encounters.slice() as Encounter[];
      res.sort((a, b) => (a.count > b.count ? -1 : 1));

      sortedEncounters.value = res.map(e => ({
        membershipId: e.membershipId,
        displayName: e.displayName,
        iconPath: e.iconPath,
        characterClass: e.characterClass,
        count: e.count
      }));
    };

    watch(() => encounters.encounters.length, throttle(sortEncounters, 1000), { immediate: true });

    // filtering
    const search = ref('');
    const filteredEncounters = computed(() =>
      sortedEncounters.value.filter(enc =>
        !search.value.length
          ? enc
          : enc.displayName?.toLowerCase().includes(search.value.toLowerCase())
      )
    );
    const slicedEncounters = computed(() => filteredEncounters.value.slice(0, 50));

    const getEncounterRanking = (encounter: EncounterDisplay) =>
      sortedEncounters.value.indexOf(encounter) + 1;

    // styling
    const cellSpacing = 'px-4 py-2';
    const cellBorder = 'border-b border-dark-400';

    return {
      search,
      slicedEncounters,

      getEncounterRanking,

      cellSpacing,
      cellBorder
    };
  }
});
</script>
