<template>
  <div id="encounters">
    <MutedText class="text-sm">
      {{ isLoading ? 'fetching activities...' : 'all activities found' }}
    </MutedText>

    <div class="text-light-700">
      <p>Found {{ encounterCount }} players</p>
    </div>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  DestinyCharacterComponent,
  DestinyHistoricalStatsPeriodGroup
} from 'bungie-api-ts/destiny2';

import MutedText from 'components/common/MutedText.vue';
import { getPGCR, getActivities } from '~/api';
import useProfile, { useWatchProfile } from '~/composables/useProfile';
import useAbortSignal from '~/composables/useAbortSignal';
import encounters, { addEncounter, setCurrentUser } from '~/stores/encounters';
import { ProfileState, CharacterLoading } from '~/interfaces';

export default defineComponent({
  components: { MutedText },
  setup() {
    const abortSignal = useAbortSignal();

    const loadings = ref<CharacterLoading[]>([]);
    const isLoading = computed(() => {
      if (!profile.characters.length) return false;

      return loadings.value.filter(l => l.loading).length > 0;
    });

    const fetchActivities = async (character: DestinyCharacterComponent, page = 0) => {
      const acts = await getActivities(character, page, abortSignal);

      if (!acts.length) {
        const loading = loadings.value.find(l => l.characterId === character.characterId);
        if (loading) loading.loading = false;

        return;
      }

      acts.forEach(async a => await handleActivity(a));
      await fetchActivities(character, page + 1);
    };

    const handleActivity = async (activity: DestinyHistoricalStatsPeriodGroup) => {
      const pgcr = await getPGCR(activity.activityDetails.instanceId, abortSignal);

      // here promise.all should be ok
      pgcr.entries
        .filter(e => e.player.destinyUserInfo.membershipId !== profile.membershipId)
        .forEach(async entry => await addEncounter(entry.player, pgcr.activityDetails.instanceId));
    };

    const profile = useProfile(useRoute());
    useWatchProfile(profile, async (profile: ProfileState) => {
      if (!profile.membershipId || !profile.characters.length) return;

      if (encounters.membershipId === profile.membershipId) return;
      await setCurrentUser(profile.membershipId);

      await Promise.all(
        profile.characters.map(c => {
          loadings.value.push({ characterId: c.characterId, loading: true });
          return fetchActivities(c, 0);
        })
      );
    });

    const encounterCount = computed(() => encounters.encounters.length);

    onUnmounted(async () => await setCurrentUser(''));

    return {
      encounterCount,

      profile,

      isLoading
    };
  }
});
</script>
