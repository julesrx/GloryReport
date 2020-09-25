<template>
  <div id="player-report">
    <p v-if="loading">Loading profile...</p>
    <template v-else>
      <h2 class="text-3xl font-bold">{{ profile.userInfo.displayName }}</h2>
      <p class="text-light-700">Found {{ encounters.length }} players</p>

      <table class="table-fixed w-full mt-4">
        <thead class="text-light-800">
          <tr>
            <td :class="['w-16 text-center', cellBorder, cellSpacing]">#</td>
            <td :class="[cellBorder, cellSpacing]">
              <input
                type="search"
                v-model="search"
                class="ml-2 bg-dark-500 focus:outline-none placeholder-light-900 w-full"
                placeholder="Search in encounters..."
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
            @select="onSelect(enc)"
          />
        </tbody>
      </table>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { BungieMembershipType, PlatformErrorCodes, ServerResponse } from 'bungie-api-ts/app';
import {
  DestinyActivityHistoryResults,
  DestinyCharacterComponent,
  DestinyPostGameCarnageReportData,
  DestinyProfileComponent
} from 'bungie-api-ts/destiny2/interfaces';

import { bhttp, bqueue, getPGCR } from '@/api';
import { Encounter } from '@/models';
import EncounterRow from '@/components/EncounterRow.vue';

export default defineComponent({
  name: 'PlayerReport',
  components: {
    EncounterRow
  },
  data() {
    return {
      loading: false,
      error: null,
      search: '',

      membershipType: null as BungieMembershipType | null,
      membershipId: null as string | null,
      profile: null as DestinyProfileComponent | null,
      characters: [] as DestinyCharacterComponent[],
      encounters: [] as Encounter[],

      cancelToken: axios.CancelToken.source(),

      selectedEncounter: null as Encounter | null
    };
  },
  computed: {
    sortedEncounters(): Encounter[] {
      return this.encounters.slice().sort((a, b) => (a.count > b.count ? -1 : 1));
    },
    filteredEncounters(): Encounter[] {
      return this.sortedEncounters.filter(enc =>
        !this.search.length
          ? enc
          : enc.displayName.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    slicedEncounters(): Encounter[] {
      return this.filteredEncounters.slice(0, 50);
    },

    cellSpacing(): string {
      return 'px-4 py-2';
    },
    cellBorder(): string {
      return 'border-b border-dark-400';
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler: function() {
        const membershipType = Number(this.$route.params['membershipType']);
        const membershipId = this.$route.params['membershipId'] as string;

        // comparing number and BungieMembershipType
        if (this.membershipType === membershipType && this.membershipId === membershipId) return;

        if (!this.profile) {
          this.cancelToken.cancel('Operation canceled by the user.');
        }
        this.getProfile(membershipType, membershipId);
      }
    }
  },
  methods: {
    async getProfile(membershipType: BungieMembershipType, membershipId: string): Promise<void> {
      try {
        this.membershipType = membershipType;
        this.membershipId = membershipId;

        this.cancelToken = axios.CancelToken.source();
        bqueue.clear();

        this.loading = true;

        this.profile = null;
        this.characters = [];
        this.encounters = [];

        const { data } = await bhttp.get(
          `Destiny2/${this.membershipType}/Profile/${this.membershipId}/`,
          {
            cancelToken: this.cancelToken.token,
            params: { components: '100,200' }
          }
        );

        if (!data.Response) throw new Error('Profile not found');

        this.profile = data.Response.profile.data;
        this.characters = Object.keys(data.Response.characters.data)
          .map(key => data.Response.characters.data[key])
          .sort((a, b) => (a.dateLastPlayed < b.dateLastPlayed ? 1 : -1));

        this.characters.forEach(c => {
          this.getActivities(c, 0);
        });
      } finally {
        this.loading = false;
      }
    },

    async getActivities(character: DestinyCharacterComponent, page: number): Promise<void> {
      const mode = 5;
      const count = 250;

      const { data } = await bhttp.get(
        `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
        {
          cancelToken: this.cancelToken.token,
          params: { count: count, mode: mode, page: page }
        }
      );

      const res: ServerResponse<DestinyActivityHistoryResults> = data;
      if (res.ErrorCode != PlatformErrorCodes.DestinyPrivacyRestriction) {
        if (res.Response.activities && res.Response.activities.length) {
          res.Response.activities.forEach(act => {
            getPGCR(act.activityDetails.instanceId, this.onPgcrResult, this.cancelToken.token);
          });

          this.getActivities(character, (page += 1));
        }
      }
    },

    onPgcrResult(pgcr: DestinyPostGameCarnageReportData): void {
      pgcr.entries.forEach(entry => {
        const player = entry.player;

        if (
          this.profile &&
          player.destinyUserInfo.displayName &&
          entry.player.destinyUserInfo.membershipId !== this.profile.userInfo.membershipId
        ) {
          const enc = this.encounters.find(e => {
            return e.membershipId === player.destinyUserInfo.membershipId;
          });

          if (enc != null && enc.count) {
            enc.count++;
            enc.instanceIds.push(pgcr.activityDetails.instanceId);

            if (!enc.displayName && player.destinyUserInfo.displayName) {
              enc.displayName = player.destinyUserInfo.displayName;
            }
            if (!enc.iconPath && player.destinyUserInfo.iconPath) {
              enc.iconPath = player.destinyUserInfo.iconPath;
            }
          } else {
            this.encounters.push(
              new Encounter(
                player.destinyUserInfo.membershipId,
                player.destinyUserInfo.membershipType,
                player.destinyUserInfo.displayName,
                player.destinyUserInfo.iconPath,
                pgcr.activityDetails.instanceId
              )
            );
          }
        }
      });
    },

    onSelect(enc: Encounter): void {
      if (this.selectedEncounter === enc) {
        this.deselectEncounter();
      } else {
        this.selectedEncounter = enc;
      }
    },
    deselectEncounter(): void {
      this.selectedEncounter = null;
    }
  }
});
</script>
