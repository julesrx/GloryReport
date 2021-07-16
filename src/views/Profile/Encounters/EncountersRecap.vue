<template>
  <table class="table-fixed w-full mt-4">
    <thead class="text-light-800">
      <tr>
        <td :class="['w-16 text-center', cellBorder, cellSpacing]">#</td>
        <td :class="[cellBorder, cellSpacing]">
          <div class="relative">
            <!-- <Search class="absolute left-0 inset-y-0 text-light-900" /> -->
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
        :ranking="sortedEncounters.indexOf(enc) + 1"
        :showBorders="i < slicedEncounters.length - 1"
        :cellBorder="cellBorder"
        :cellSpacing="cellSpacing"
      />
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import EncounterRow from '~/components/Encounters/EncounterRow.vue';
import EncountersStore from '~/stores/encounters';
import { Encounter } from '~/models';

export default defineComponent({
  components: { EncounterRow },
  setup() {
    const encountersState = ref(EncountersStore.state);

    // sorting
    const sortedEncounters = computed(() => {
      const encounters = encountersState.value.encounters.slice() as Encounter[];
      encounters.sort((a, b) => (a.count > b.count ? -1 : 1));

      return encounters;
    });

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

    // styling
    const cellSpacing = 'px-4 py-2';
    const cellBorder = 'border-b border-dark-400';

    return {
      encountersState,

      sortedEncounters,

      search,
      slicedEncounters,

      cellSpacing,
      cellBorder
    };
  }
});
</script>
