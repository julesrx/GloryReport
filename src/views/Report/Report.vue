<template>
  <div id="player-report">
    <p v-if="loadingProfile">Loading profile...</p>
    <template v-if="!loadingProfile && profile">
      <div class="flex items-baseline space-x-2">
        <h2 class="text-3xl font-bold">{{ profile.userInfo.displayName }}</h2>
        <span v-if="isLoading" class="text-sm text-light-800">fetching activities...</span>
      </div>

      <div class="flex justify-between text-light-700">
        <p>
          Found {{ encountersState.encounters.length }} players
          <span v-if="wasCanceled">(search canceled)</span>
        </p>
        <X
          v-if="isLoading"
          @click="cancelAll(true)"
          class="cursor-pointer"
          title="Cancel non-cached requests"
        />
      </div>

      <router-view></router-view>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import axios from 'axios';
import { BungieMembershipType, PlatformErrorCodes, ServerResponse } from 'bungie-api-ts/app';
import {
  DestinyActivityHistoryResults,
  DestinyCharacterComponent,
  DestinyPostGameCarnageReportData
} from 'bungie-api-ts/destiny2/interfaces';

import { bhttp, getPGCR } from '@/api';
import EncountersStore from '@/stores/encounters';
import useGetProfile from '@/composables/useGetProfile';
import X from '@/components/icons/X.vue';

export default defineComponent({
  components: {
    X
  },
  setup() {
    // state
    const encountersState = ref(EncountersStore.state);

    // profile fetching
    const { getProfile, profile, characters, loadingProfile, cancelToken } = useGetProfile();

    // Loadings
    class Loading {
      constructor(characterId: string) {
        this.characterId = characterId;
        this.loading = true;
      }

      characterId: string;
      loading: boolean;
    }
    const loadings = ref([] as Loading[]);
    const isLoading = computed(() => {
      if (!characters.value.length) return false;
      else {
        return loadings.value.filter((l) => l.loading).length > 0;
      }
    });

    // Get PGCRs
    const onPgcrResult = (pgcr: DestinyPostGameCarnageReportData): void => {
      pgcr.entries.forEach((entry) => {
        const player = entry.player;

        if (
          profile.value &&
          player.destinyUserInfo.displayName &&
          entry.player.destinyUserInfo.membershipId !== profile.value.userInfo.membershipId
        ) {
          EncountersStore.addEncounter(pgcr.activityDetails.instanceId, player);
        }
      });
    };

    const getActivities = async (
      character: DestinyCharacterComponent,
      page: number
    ): Promise<void> => {
      const mode = 5;
      const count = 250;

      try {
        const { data } = await bhttp.get(
          `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
          {
            cancelToken: cancelToken.value.token,
            params: { count: count, mode: mode, page: page }
          }
        );

        const res: ServerResponse<DestinyActivityHistoryResults> = data;
        if (res.ErrorCode != PlatformErrorCodes.DestinyPrivacyRestriction) {
          if (res.Response.activities && res.Response.activities.length) {
            res.Response.activities.forEach((act) => {
              getPGCR(act.activityDetails.instanceId, cancelToken.value.token).then(onPgcrResult);
            });

            getActivities(character, (page += 1));
          } else {
            const loading = loadings.value.find((l) => l.characterId === character.characterId);
            if (loading) {
              loading.loading = false;
            }
          }
        }
      } catch (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('activities canceled: ', thrown.message);
        } else {
          console.error(thrown);
        }
      }
    };

    // cancel
    const wasCanceled = ref(false); // todo useCancel
    const cancelAll = (isManualCancel: boolean) => {
      cancelToken.value.cancel('Cancelled by new profile fetch');
      loadings.value.forEach((l) => (l.loading = false));
      wasCanceled.value = isManualCancel;
    };

    // route watching
    const route = useRoute();
    watch(
      () => route.params,
      async (params) => {
        const membershipType = (params['membershipType'] as unknown) as BungieMembershipType;
        const membershipId = params['membershipId'] as string;

        if (
          !profile.value ||
          (profile.value &&
            (profile.value.userInfo.membershipType.toString() !== membershipType.toString() ||
              profile.value.userInfo.membershipId !== membershipId))
        ) {
          if (membershipType && membershipId) {
            cancelAll(false);

            getProfile(membershipType, membershipId, true).then(() => {
              characters.value.forEach((c) => {
                loadings.value.push(new Loading(c.characterId));
                getActivities(c, 0);
              });
            });
          }
        }
      },
      { immediate: true }
    );

    return {
      encountersState,

      loadingProfile,
      profile,

      isLoading,

      wasCanceled,
      cancelAll
    };
  }
});
</script>
