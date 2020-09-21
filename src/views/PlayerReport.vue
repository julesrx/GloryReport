<template>
  <div id="player-report">
    <p v-if="loading">Loading profile...</p>
    <ul>
      <li v-for="enc in filteredEncounters" :key="enc.membershipId">
        {{ enc.displayName }} ({{ enc.count }})
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

import PQueue from 'p-queue';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { BungieMembershipType, PlatformErrorCodes, ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyActivityHistoryResults,
  DestinyActivityModeType,
  DestinyCharacterComponent,
  DestinyPostGameCarnageReportData,
  DestinyProfileComponent,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2/interfaces';

import { bhttp } from '@/http-common';

@Component
export default class PlayerReport extends Vue {
  private cancelTokenSource: CancelTokenSource;

  private membershipType: BungieMembershipType;
  private membershipId: string;
  private profile: DestinyProfileComponent = null;
  private characters: DestinyCharacterComponent[] = [];
  // private activities: DestinyHistoricalStatsPeriodGroup[] = [];
  private encounters: any[] = [];

  private loading = true;

  private queue = new PQueue({
    intervalCap: 20,
    interval: 1000
  });

  @Watch('$route', { immediate: true, deep: true })
  onRouting() {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('Operation canceled by the user.');
    }

    this.fetchPlayerProfile();
  }

  private async fetchPlayerProfile() {
    try {
      this.cancelTokenSource = axios.CancelToken.source();
      this.queue.clear();

      this.loading = true;

      this.membershipType = +this.$route.params['membershipType'];
      this.membershipId = this.$route.params['membershipId'];

      this.profile = null;
      this.characters = [];
      // this.activities = [];
      this.encounters = [];

      const { data }: AxiosResponse<ServerResponse<DestinyProfileResponse>> = await bhttp.get(
        `Destiny2/${this.membershipType}/Profile/${this.membershipId}/`,
        {
          cancelToken: this.cancelTokenSource.token,
          params: { components: '100,200' }
        }
      );

      if (!data.Response) throw new Error('Profile not found');

      this.profile = data.Response.profile.data;
      this.characters = Object.keys(data.Response.characters.data)
        .map(key => data.Response.characters.data[key])
        .sort((a, b) => (a.dateLastPlayed < b.dateLastPlayed ? 1 : -1));

      this.characters.forEach(c => {
        this.getActivities(c, DestinyActivityModeType.AllPvP, 0);
      });
    } finally {
      this.loading = false;
    }
  }

  private async getActivities(
    character: DestinyCharacterComponent,
    mode: DestinyActivityModeType,
    page: number,
    count = 250
  ) {
    const { data }: AxiosResponse<ServerResponse<DestinyActivityHistoryResults>> = await bhttp.get(
      `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
      {
        cancelToken: this.cancelTokenSource.token,
        params: { count: count, mode: mode, page: page }
      }
    );

    if (data.ErrorCode !== PlatformErrorCodes.DestinyPrivacyRestriction) {
      if (data.Response.activities && data.Response.activities.length) {
        data.Response.activities.forEach(act => {
          this.getPGCR(act.activityDetails.instanceId);
        });

        // this.activities = this.activities.concat(data.Response.activities);
        this.getActivities(character, mode, (page += 1));
      } else {
        // no more activities
      }
    }
  }

  private async getPGCR(instanceId: string) {
    // if PGCR is in cache, do not add to the queue
    await this.queue.add(() =>
      bhttp
        .get(`Destiny2/Stats/PostGameCarnageReport/${instanceId}/`, {
          cancelToken: this.cancelTokenSource.token
        })
        .then(res => res.data)
        .then((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
          const pgcr = res.Response;
          // console.log(res.Response);
          pgcr.entries.forEach(entry => {
            if (entry.player.destinyUserInfo.membershipId !== this.profile.userInfo.membershipId) {
              const enc = this.encounters.find(e => {
                return e.membershipId === entry.player.destinyUserInfo.membershipId;
              });

              if (enc != null && enc.count) {
                enc.count++;
                enc.instanceIds.push(pgcr.activityDetails.instanceId);

                if (!enc.displayName && entry.player.destinyUserInfo.displayName) {
                  enc.displayName = entry.player.destinyUserInfo.displayName;
                }
                if (!enc.iconPath && entry.player.destinyUserInfo.iconPath) {
                  enc.iconPath = entry.player.destinyUserInfo.iconPath;
                }
              } else {
                this.encounters.push({
                  membershipId: entry.player.destinyUserInfo.membershipId,
                  membershipType: entry.player.destinyUserInfo.membershipType,
                  displayName: entry.player.destinyUserInfo.displayName, // can be undefined
                  iconPath: entry.player.destinyUserInfo.iconPath, // can be undefined
                  instanceIds: [pgcr.activityDetails.instanceId],
                  count: 1
                });
              }

              this.encounters.sort((a, b) => {
                return a.count < b.count ? 1 : -1;
              });
            }
          });
        })
        .catch(thrown => {
          if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            // handle error
          }
        })
    );
  }

  get filteredEncounters() {
    return this.encounters.sort((a, b) => (a.count > b.count ? -1 : 1)).slice(0, 20);
  }
}
</script>
