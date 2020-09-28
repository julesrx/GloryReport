<template>
  <div id="player-report">
    <p v-if="loadingProfile">Loading profile...</p>
    <template v-if="!loadingProfile && profile">
      <h2 class="text-3xl font-bold">{{ profile.userInfo.displayName }}</h2>
      <p class="text-light-700">Found {{ encountersState.encounters.length }} players</p>

      <table class="table-fixed w-full mt-4">
        <thead class="text-light-800">
          <tr>
            <td :class="['w-16 text-center', cellBorder, cellSpacing]">#</td>
            <td :class="[cellBorder, cellSpacing]">
              <input
                type="search"
                v-model="search"
                class="ml-2 bg-dark-500 focus:outline-none placeholder-light-900 w-full"
                placeholder="Search..."
              />
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
            :isSelected="selectedEncounter === enc"
            :showBorders="i < slicedEncounters.length - 1"
            :cellBorder="cellBorder"
            :cellSpacing="cellSpacing"
            @select="selectEncounter(enc)"
          />
        </tbody>
      </table>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { BungieMembershipType, PlatformErrorCodes, ServerResponse } from 'bungie-api-ts/app';
import {
  DestinyActivityHistoryResults,
  DestinyCharacterComponent,
  DestinyPostGameCarnageReportData
} from 'bungie-api-ts/destiny2/interfaces';

import { bhttp, getPGCR } from '@/api';
import { Encounter } from '@/models';
import EncounterRow from '@/components/EncounterRow.vue';
import EncountersStore from '@/stores/encounters-store';
import useSelectEncounter from '@/use/selectEncounter';
import useGetProfile from '@/use/getProfile';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    EncounterRow
  },
  setup() {
    // state
    const encountersState = ref(EncountersStore.state);

    // profile fetching
    const { getProfile, profile, characters, loadingProfile, cancelToken } = useGetProfile();

    // Get PGCRs
    const onPgcrResult = (pgcr: DestinyPostGameCarnageReportData): void => {
      pgcr.entries.forEach(entry => {
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
          res.Response.activities.forEach(act => {
            getPGCR(act.activityDetails.instanceId, onPgcrResult, cancelToken.value.token);
          });

          getActivities(character, (page += 1));
        }
      }
    };

    // on component access
    onMounted(async () => {
      const route = useRoute();

      const membershipType = (route.params['membershipType'] as unknown) as BungieMembershipType;
      const membershipId = route.params['membershipId'] as string;

      if (
        !profile.value ||
        (profile &&
          (profile.value.userInfo.membershipType !== membershipType ||
            profile.value.userInfo.membershipId !== membershipId))
      ) {
        if (membershipType && membershipId) {
          await getProfile(membershipType, membershipId, true);

          characters.value.forEach(c => {
            getActivities(c, 0);
          });
        }
      }
    });

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
          : enc.displayName.toLowerCase().includes(search.value.toLowerCase())
      )
    );
    const slicedEncounters = computed(() => filteredEncounters.value.slice(0, 50));

    // selecting encounters
    const selectedEncounter = ref(null as Encounter | null);
    const { selectEncounter } = useSelectEncounter(selectedEncounter);

    // styling
    const cellSpacing = 'px-4 py-2';
    const cellBorder = 'border-b border-dark-400';

    return {
      cancelToken,
      encountersState,

      loadingProfile,
      profile,

      sortedEncounters,

      search,
      filteredEncounters,
      slicedEncounters,

      selectedEncounter,
      selectEncounter,

      cellSpacing,
      cellBorder
    };
  }
});
</script>
