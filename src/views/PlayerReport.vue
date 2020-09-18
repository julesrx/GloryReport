<template>
  <div id="player-report">
    <p v-if="loading">Loading profile...</p>
    <pre>{{ profile }}</pre>
    <pre>{{ characters }}</pre>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

import { AxiosResponse } from 'axios';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyCharacterComponent,
  DestinyProfileComponent,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2/interfaces';

import { bhttp } from '@/http-common';

@Component
export default class PlayerReport extends Vue {
  private membershipType: BungieMembershipType;
  private membershipId: string;
  private profile: DestinyProfileComponent = null;
  private characters: DestinyCharacterComponent[] = [];

  private loading = true;

  @Watch('$route', { immediate: true, deep: true })
  onRouting() {
    this.fetchPlayerProfile();
  }

  private async fetchPlayerProfile() {
    try {
      this.loading = true;

      this.membershipType = +this.$route.params['membershipType'];
      this.membershipId = this.$route.params['membershipId'];

      this.profile = null;
      this.characters = [];

      const { data }: AxiosResponse<ServerResponse<DestinyProfileResponse>> = await bhttp.get(
        `Destiny2/${this.membershipType}/Profile/${this.membershipId}/`,
        {
          params: { components: '100,200' }
        }
      );

      if (!data.Response) throw new Error('Profile not found');

      this.profile = data.Response.profile.data;
      this.characters = Object.keys(data.Response.characters.data)
        .map(key => data.Response.characters.data[key])
        .sort((a, b) => (a.dateLastPlayed < b.dateLastPlayed ? 1 : -1));
    } finally {
      this.loading = false;
    }
  }
}
</script>
