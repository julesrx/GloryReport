<template>
  <div id="player-report">
    <p v-if="loading">Loading profile...</p>

    <input type="text" v-model="search" />
    <p>{{ encounters.length }} players</p>

    <EncounterItem
      v-for="enc in filteredEncounters"
      :key="enc.membershipId"
      :encounter="enc"
      :selected="selectedEncounter === enc"
      @click="selectedEncounter = enc"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { PlatformErrorCodes } from 'bungie-api-ts/app';

import { bhttp, bqueue, getPGCR } from '@/api';
import Encounter from '@/classes/Encounter';
import EncounterItem from '@/components/EncounterItem.vue';
import { requestCache } from '@/storage';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2/interfaces';

export default defineComponent({
  name: 'PlayerReport',
  components: {
    EncounterItem
  },
  data() {
    return {
      loading: false,
      error: null,
      search: '',

      membershipType: null,
      membershipId: null,
      profile: null as any,
      characters: [] as any[],
      encounters: [] as Encounter[],

      cancelToken: axios.CancelToken.source(),

      selectedEncounter: (null as unknown) as Encounter
    };
  },
  computed: {
    filteredEncounters(): Encounter[] {
      return this.encounters
        .slice()
        .filter(enc =>
          !this.search.length
            ? enc
            : enc.displayName.toLowerCase().includes(this.search.toLowerCase())
        )
        .sort((a, b) => a.count - b.count)
        .reverse()
        .slice(0, 50);
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler: function() {
        const membershipType = Number(this.$route.params['membershipType']);
        const membershipId = this.$route.params['membershipId'];

        if (this.membershipType === membershipType && this.membershipId === membershipId) return;

        if (!this.profile) {
          this.cancelToken.cancel('Operation canceled by the user.');
        }
        this.getProfile(membershipType, membershipId);
      }
    }
  },
  methods: {
    async getProfile(membershipType: any, membershipId: any) {
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

    async getActivities(character: any, page: number) {
      const mode = 5;
      const count = 250;

      const { data } = await bhttp.get(
        `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
        {
          cancelToken: this.cancelToken.token,
          params: { count: count, mode: mode, page: page }
        }
      );

      if (data.ErrorCode != PlatformErrorCodes.DestinyPrivacyRestriction) {
        if (data.Response.activities && data.Response.activities.length) {
          data.Response.activities.forEach((act: any) => {
            getPGCR(act.activityDetails.instanceId, this.pgcrCallback, this.cancelToken.token);
          });

          this.getActivities(character, (page += 1));
        }
      }
    },

    pgcrCallback(pgcr: DestinyPostGameCarnageReportData) {
      pgcr.entries.forEach((entry: any) => {
        const player = entry.player;

        if (
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
    }
  }
});
</script>