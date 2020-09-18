<template>
  <div id="player-search">
    <input type="search" v-model="search" placeholder="Gamertag..." />
    <p v-if="fetching">fetching...</p>
    <ul v-if="users.length">
      <li v-for="user in users" :key="user.membershipType + '-' + user.membershipId">
        <router-link
          :to="{
            name: 'PlayerReport',
            params: { membershipType: user.membershipType, membershipId: user.membershipId }
          }"
          >{{ user.displayName }}</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import { debounce } from 'lodash';

import { bhttp } from '@/http-common';
import { AxiosResponse } from 'axios';

@Component
export default class PlayerSearch extends Vue {
  private search = '';
  private users: UserInfoCard[] = [];
  private fetching = false;

  private debounceSearch = debounce((val: string) => this.searchPlayer(val), 500);

  @Watch('search')
  private onSearch(val: string) {
    this.fetching = true;
    this.debounceSearch(val);
  }

  private async searchPlayer(search: string) {
    this.users = [];

    const { data }: AxiosResponse<ServerResponse<UserInfoCard[]>> = await bhttp.get(
      `Destiny2/SearchDestinyPlayer/${BungieMembershipType.All}/${encodeURIComponent(
        search.trim()
      )}/`
    );

    this.fetching = false;
    this.users = data.Response.filter(
      (user, index, self) =>
        index ===
        self.findIndex(
          t => t.membershipType === user.membershipType && t.membershipId === user.membershipId
        )
    );
  }
}
</script>
