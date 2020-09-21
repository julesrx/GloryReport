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

<script>
import { debounce } from 'lodash';

export default {
  name: 'PlayerSearch',
  data() {
    return {
      users: [],
      search: '',
      fetching: false
    };
  },
  watch: {
    search: debounce(async function(val) {
      this.users = [];

      const { data } = await this.$bhttp.get(
        `Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(val.trim())}/`
      );

      this.fetching = false;
      this.users = data.Response.filter(
        (user, index, self) =>
          index ===
          self.findIndex(
            t => t.membershipType === user.membershipType && t.membershipId === user.membershipId
          )
      );
    }, 500)
  }
};
</script>
