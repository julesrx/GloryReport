<template>
  <div id="player-search" class="max-w-xs mx-auto">
    <input
      type="search"
      v-model="search"
      placeholder="Guardian..."
      autofocus
      :class="[
        'text-dark-500 placeholder-dark-300 border py-1 px-2 rounded shadow mb-5 block w-full focus:outline-none',
        small ? null : 'text-lg'
      ]"
    />

    <div class="flex justify-center flex-wrap" v-if="!noresult && users.length">
      <router-link
        v-for="user in users"
        :key="user.membershipType + '-' + user.membershipId"
        :to="{
          name: 'PlayerReport',
          params: { membershipType: user.membershipType, membershipId: user.membershipId }
        }"
        class="flex items-center mx-2 mb-4"
        @click.passive="users = []"
      >
        <img
          :src="`https://bungie.net${user.iconPath}`"
          :alt="user.displayName"
          class="h-5 w-auto pr-1 pointer-events-none"
        />
        <span class="whitespace-no-wrap">{{ user.displayName }}</span>
      </router-link>
    </div>
    <p v-if="noresult" class="text-center">No player found</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { debounce } from 'lodash';

import { bhttp } from '@/api';
import { ServerResponse } from 'bungie-api-ts/app';

export default defineComponent({
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const users = ref([] as UserInfoCard[]);

    const search = ref('');
    const noresult = ref(false);
    const debouncedOnSearch = debounce(async () => {
      users.value = [];
      noresult.value = false;
      if (!search.value) return;

      try {
        const { data } = await bhttp.get(
          `Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(search.value.trim())}/`
        );

        const res: ServerResponse<UserInfoCard[]> = data;
        if (res.Response.length) {
          users.value = res.Response.filter(
            (user, index, self) =>
              index ===
              self.findIndex(
                t =>
                  t.membershipType === user.membershipType && t.membershipId === user.membershipId
              )
          );
        } else noresult.value = true;
      } catch (ex) {
        users.value = [];
      }
    }, 500);
    watch(search, debouncedOnSearch);

    return { users, search, noresult };
  }
});
</script>
