<template>
  <div id="encounters">
    <span class="text-sm opacity-50">{{
      isLoading ? 'fetching activities...' : 'all activities found'
    }}</span>

    <div class="flex justify-between text-light-700">
      <p>Found {{ encounterssCount }} players</p>
    </div>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { DestinyCharacterComponent } from 'bungie-api-ts/destiny2';

import { getPGCR, getActivities } from '~/api';
import useProfile, { useWatchProfile } from '~/composables/useProfile';
import useCancelToken from '~/composables/useCancelToken';
import encounters, { addEncounter, setCurrentUser } from '~/stores/encounters';
import { ProfileState } from '~/interfaces';
import { CharacterLoading } from '~/models';

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

      acts.forEach(async act => {
        const pgcr = await getPGCR(act.activityDetails.instanceId, cancelToken.token);
        pgcr.entries.forEach(entry => {
          const player = entry.player;

          if (entry.player.destinyUserInfo.membershipId !== profile.membershipId) {
            addEncounter(pgcr.activityDetails.instanceId, player);
          }
        });
      });

      await fetchActivities(character, page + 1);
    };

    const profile = useProfile(useRoute());
    useWatchProfile(profile, async (profile: ProfileState) => {
      if (!profile.membershipId || !profile.characters.length) return;

      if (encounters.membershipId === profile.membershipId) return;
      setCurrentUser(profile.membershipId);

      await Promise.all(
        profile.characters.map(c => {
          loadings.value.push(new CharacterLoading(c.characterId));
          return fetchActivities(c, 0);
        })
      );
    });

    const encounterssCount = computed(() => encounters.encounters.length);

    return {
      encounterssCount,

      profile,

      isLoading
    };
  }
});
</script>
