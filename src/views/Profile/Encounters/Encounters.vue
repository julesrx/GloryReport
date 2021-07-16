<template>
  <div id="encounters">
    <p v-if="!profile.profile">Loading profile...</p>
    <template v-else>
      <div class="flex items-baseline space-x-2">
        <h2 class="text-3xl font-bold">{{ profile.profile.userInfo.displayName }}</h2>
        <span v-if="isLoading" class="text-sm text-light-800">fetching activities...</span>
      </div>

      <div class="flex justify-between text-light-700">
        <p>
          Found {{ encountersState.encounters.length }} players
          <!-- <span v-if="wasCanceled">(search canceled)</span> -->
        </p>
        <!-- <X
          v-if="isLoading"
          @click="cancelAll(true)"
          class="cursor-pointer"
          title="Cancel non-cached requests"
        /> -->
      </div>

      <router-view></router-view>
    </template>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import {
  DestinyActivityHistoryResults,
  DestinyActivityModeType,
  DestinyCharacterComponent,
  ServerResponse
} from 'bungie-api-ts/destiny2';

import api, { getPGCR } from '~/api';
import useProfile, { useWatchProfile } from '~/composables/useProfile';
import EncountersStore from '~/stores/encounters';
import { ProfileState } from '~/interfaces';
import { CharacterLoading } from '~/models';

// cancel token here

export default defineComponent({
  setup() {
    const encountersState = ref(EncountersStore.state);

    const loadings = ref<CharacterLoading[]>([]);
    const isLoading = computed(() => {
      if (!profile.characters.length) return false;

      return loadings.value.filter(l => l.loading).length > 0;
    });

    const fetchActivities = async (character: DestinyCharacterComponent, page = 0) => {
      const mode = DestinyActivityModeType.AllPvP;
      const count = 250;

      const res = await api.get<ServerResponse<DestinyActivityHistoryResults>>(
        `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
        {
          params: { count: count, mode: mode, page: page }
          // cancelToken: cancelToken.token
        }
      );

      if (!res.data.Response.activities) {
        const loading = loadings.value.find(l => l.characterId === character.characterId);
        if (loading) loading.loading = false;

        return;
      }

      res.data.Response.activities.forEach(async act => {
        const pgcr = await getPGCR(act.activityDetails.instanceId);
        pgcr.entries.forEach(entry => {
          const player = entry.player;

          if (entry.player.destinyUserInfo.membershipId !== profile.membershipId) {
            EncountersStore.addEncounter(pgcr.activityDetails.instanceId, player);
          }
        });
      });

      await fetchActivities(character, page + 1);
    };

    const profile = useProfile(useRoute());
    useWatchProfile(profile, async (profile: ProfileState) => {
      if (!profile.membershipId || !profile.characters.length) return;

      if (encountersState.value.membershipId === profile.membershipId) return;
      EncountersStore.setCurrentUser(profile.membershipId);

      await Promise.all(
        profile.characters.map(c => {
          loadings.value.push(new CharacterLoading(c.characterId));
          return fetchActivities(c, 0);
        })
      );
    });

    return {
      encountersState,

      profile,

      isLoading

      // wasCanceled,
      // cancelAll
    };
  }
});
</script>
