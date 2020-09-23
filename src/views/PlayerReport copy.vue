<template>
  <div id="player-report">
    <p v-if="loading">Loading profile...</p>

    <input type="text" v-model="search" />
    <p>{{ encounters.length }} players</p>
    <EncounterItem v-for="enc in filteredEncounters" :key="enc.membershipId" :encounter="enc" />
  </div>
</template>

<script>
import axios from 'axios';

import { bhttp, bqueue } from '@/api';
import Encounter from '@/classes/Encounter';
import EncounterItem from '@/components/EncounterItem.vue';
import { requestCache } from '@/storage';

export default {
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
      profile: null,
      characters: [],
      encounters: [],

      cancelToken: null
    };
  },
  computed: {
    filteredEncounters() {
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

        if (this.cancelToken) {
          this.cancelToken.cancel('Operation canceled by the user.');
        }
        this.getProfile(membershipType, membershipId);
      }
    }
  },
  methods: {
    async getProfile(membershipType, membershipId) {
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

    async getActivities(character, page) {
      const mode = 5;
      const count = 250;

      const { data } = await bhttp.get(
        `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
        {
          cancelToken: this.cancelToken.token,
          params: { count: count, mode: mode, page: page }
        }
      );

      if (data.ErrorCode != 1665) {
        // PlatformErrorCodes.DestinyPrivacyRestriction
        if (data.Response.activities && data.Response.activities.length) {
          data.Response.activities.forEach(act => {
            this.getPGCR(act.activityDetails.instanceId);
          });

          this.getActivities(character, (page += 1));
        }
      }
    },

    getPGCR(instanceId) {
      const requestUrl = `Destiny2/Stats/PostGameCarnageReport/${instanceId}/`;

      requestCache.getItem(requestUrl).then(res => {
        if (res) return this.pgcrCallback(res);
        else
          return bqueue.add(() =>
            bhttp
              .get(requestUrl, { cancelToken: this.cancelToken.token })
              .then(res => res.data.Response)
              .then(res => {
                requestCache.setItem(requestUrl, res);
                this.pgcrCallback(res);
              })
          );
      });
    },

    pgcrCallback(pgcr) {
      pgcr.entries.forEach(entry => {
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
};
</script>
