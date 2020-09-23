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
import { defineComponent, ref, watch } from 'vue';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { debounce } from 'lodash';

import { bhttp } from '@/api';

export default defineComponent({
  name: 'PlayerSearch',
  setup() {
    const fetching = ref(false);
    const users = ref([] as UserInfoCard[]);

    const search = ref('');
    const debouncedOnSearch = debounce(async () => {
      users.value = [];

      const { data } = await bhttp.get(
        `Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(search.value.trim())}/`
      );

      fetching.value = false;
      users.value = data.Response.filter(
        (user: UserInfoCard, index: number, self: UserInfoCard[]) =>
          index ===
          self.findIndex(
            t => t.membershipType === user.membershipType && t.membershipId === user.membershipId
          )
      );
    }, 500);
    watch(search, debouncedOnSearch);

    return { users, search, fetching };
  }
});
</script>
