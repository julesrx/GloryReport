<template>
  <router-link
    :to="{
      name: 'ReportEncounters',
      params: parentParams
    }"
  >
    <ArrowNarrowLeft title="Back to all encounters" class="inline-block" />
  </router-link>

  <template v-if="encounter">
    <div class="flex justify-center items-center space-x-3">
      <EncounterIcon :encounter="encounter" :size="64" />
      <p class="text-2xl">{{ encounter.displayName }}</p>
    </div>

    <div v-if="encounter.instanceIds" class="mt-4 space-y-2">
      <p class="text-center">{{ encounter.instanceIds.length }} activities found</p>
      <div class="divide-y divide-dark-400">
        <ActivityItem
          v-for="instanceId in encounter.instanceIds"
          :key="instanceId"
          :instanceId="instanceId"
          class="max-w-4xl mx-auto"
        />
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

import EncountersStore from '@/stores/encounters-store';
import EncounterIcon from '@/components/EncounterIcon.vue';
import ActivityItem from '@/components/ActivityItem.vue';
import ArrowNarrowLeft from '@/components/icons/ArrowNarrowLeft.vue';

export default defineComponent({
  components: {
    EncounterIcon,
    ActivityItem,
    ArrowNarrowLeft
  },
  setup() {
    const encountersState = ref(EncountersStore.state);

    const route = useRoute();
    const encounter = computed(() => {
      if (!route.params['selectedMembershipId']) return null;
      else
        return encountersState.value.encounters.find(
          e => e.membershipId === route.params['selectedMembershipId']
        );
    });

    const parentParams = computed(() => {
      return {
        membershipType: route.params['membershipType'],
        membershipId: route.params['membershipId']
      };
    });

    return { encountersState, encounter, parentParams };
  }
});
</script>
