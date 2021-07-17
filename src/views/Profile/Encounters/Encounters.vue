<template>
  <div id="encounters">
    <span class="text-sm opacity-50">{{
      isLoading ? 'fetching activities...' : 'all activities found'
    }}</span>

    <div class="flex justify-between text-light-700">
      <p>Found {{ encounterCount }} players</p>
    </div>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import {
  DestinyCharacterComponent,
  DestinyHistoricalStatsPeriodGroup
} from 'bungie-api-ts/destiny2';

import { getPGCR, getActivities } from '~/api';
import useProfile, { useWatchProfile } from '~/composables/useProfile';
import useCancelToken from '~/composables/useCancelToken';
import encounters, { addEncounter, setCurrentUser } from '~/stores/encounters';
import { ProfileState, CharacterLoading } from '~/interfaces';

export default defineComponent({
  setup() {
    const cancelToken = useCancelToken();

    const loadings = ref<CharacterLoading[]>([]);
    const isLoading = computed(() => {
      if (!profile.characters.length) return false;

      return loadings.value.filter(l => l.loading).length > 0;
    });

    const fetchActivities = async (character: DestinyCharacterComponent, page = 0) => {
      const acts = await getActivities(character, page, cancelToken.token);

      if (!acts.length) {
        const loading = loadings.value.find(l => l.characterId === character.characterId);
        if (loading) loading.loading = false;

        return;
      }

      acts.forEach(async a => await handleActivity(a));
      await fetchActivities(character, page + 1);
    };

    const handleActivity = async (activity: DestinyHistoricalStatsPeriodGroup) => {
      const pgcr = await getPGCR(activity.activityDetails.instanceId, cancelToken.token);

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

    return {
      encounterCount,

      profile,

      isLoading
    };
  }
});
</script>
