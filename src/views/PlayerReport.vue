<template>
  <div id="player-report">
    <p v-if="loading">Loading profile...</p>
    <pre>{{ profile }}</pre>
    <pre>{{ characters }}</pre>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import {
  DestinyCharacterComponent,
  DestinyProfileComponent,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2/interfaces';

import { BungieHttp } from '@/libs/http';
import { AxiosResponse } from 'axios';
import { ServerResponse } from 'bungie-api-ts/common';

@Component
export default class PlayerReport extends Vue {
  private membershipType: number = +this.$route.params['membershipType']; // TODO: transform to BungieMembershipType
  private membershipId: string = this.$route.params['membershipId'];

  private loading = true;

  private profile: DestinyProfileComponent = null;
  private characters: DestinyCharacterComponent[] = [];

  private async created() {
    try {
      const { data }: AxiosResponse<ServerResponse<DestinyProfileResponse>> = await BungieHttp.get(
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
      this.loading = true;
    }
  }
}
</script>
