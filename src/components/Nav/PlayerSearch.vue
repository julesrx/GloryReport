<template>
  <div :id="elId" class="relative max-w-xs mx-auto">
    <div class="relative text-light-500">
      <input
        type="text"
        v-model="search"
        placeholder="Guardian..."
        @click="debouncedOnSearch"
        :class="[
          'placeholder-dark-50 bg-dark-500 py-1 pl-2 pr-8 rounded shadow block w-full focus:outline-none',
          sizeClasses
        ]"
      />
      <div v-if="search" class="absolute inset-y-0 right-0 flex items-center">
        <XIcon class="cursor-pointer h-full mr-1 h-5 w-5" @click="search = ''" />
      </div>
    </div>

    <div
      v-if="search"
      :class="['bg-dark-500 rounded shadow absolute w-full mt-1 z-10', sizeClasses]"
    >
      <ul class="max-h-56 overflow-auto">
        <li v-if="loading" class="px-2 py-1 text-dark-50">Searching...</li>
        <li v-else-if="!loading && noresult && !users.length" class="px-2 py-1 text-dark-50">
          No player found...
        </li>
        <li
          v-else-if="!loading && !noresult && users.length"
          v-for="user in users"
          :key="`${user.membershipType}-${user.membershipId}`"
        >
          <router-link
            :to="`/${user.membershipType}/${user.membershipId}`"
            class="flex items-center space-x-2 px-2 py-1 hover:bg-dark-300 rounded"
            @click.passive="users = []"
          >
            <img
              :src="`https://bungie.net${user.iconPath}`"
              :alt="user.displayName"
              :class="[
                'flex-shrink-0 h-5 w-5 pointer-events-none',
                userIsSteam(user) ? 'invert-1' : null
              ]"
            />
            <span class="whitespace-no-wrap">{{ user.displayName }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { ServerResponse } from 'bungie-api-ts/app';
import { debounce } from 'lodash-es';
import { XIcon } from 'heroicons-vue3/solid';

import api from '~/api';

export default defineComponent({
  components: { XIcon },
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const users = ref<UserInfoCard[]>([]);

    const search = ref('');
    const noresult = ref(false);
    const loading = ref(false);
    const debouncedOnSearch = debounce(async () => {
      users.value = [];
      noresult.value = false;
      if (!search.value) return;

      try {
        loading.value = true;
        const { data } = await api.get(
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
      } finally {
        loading.value = false;
      }
    }, 250);
    watch(search, debouncedOnSearch);

    // cant check the membershipType because some player have the steam logo with others membershipTypes
    const userIsSteam = (user: UserInfoCard) => user.iconPath.toLowerCase().includes('steam');

    const sizeClasses = computed(() => {
      const classes = [];
      if (!props.small) classes.push('text-lg');
      return classes;
    });

    // clear users results when clicking elsewhere
    const elId = 'player-search';
    onMounted(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.addEventListener('click', (e: any) => {
        if (!e.target.closest(elId)) {
          users.value = [];
        }
      });
    });

    return {
      users,

      search,
      noresult,
      loading,
      debouncedOnSearch,

      userIsSteam,
      sizeClasses,

      elId
    };
  }
});
</script>
