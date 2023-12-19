<script setup lang="ts">
import type { UserInfoCard } from 'bungie-api-ts/user';

const results = ref<UserInfoCard[]>();
const search = ref('');
const searching = ref(false);
watchDebounced(
    search,
    async search => {
        searching.value = true;

        try {
            if (!search) {
                results.value = [];
                return;
            }

            const res = await searchByGlobalNamePost(search);
            results.value = res.Response.searchResults.map(l => l.destinyMemberships[0]);
        } finally {
            searching.value = false;
        }
    },
    { debounce: 500 }
);

const resultClass = 'bg-black-muted py-1 px-2 shadow block w-full rounded';
</script>

<template>
    <div class="relative">
        <input
            id="gamertag"
            v-model="search"
            type="search"
            class="placeholder-white-muted bg-black-muted py-1 px-2 rounded shadow block w-full focus:outline-none"
            placeholder="Gamertag"
            autofocus
        />

        <ul v-if="search" class="absolute w-full mt-1 max-h-52 overflow-y-auto">
            <li v-if="searching" :class="resultClass">Searching...</li>
            <template v-else>
                <li v-if="results && !results.length" :class="resultClass">No results...</li>
                <li v-for="r in results" :key="getMembershipTypeId(r)">
                    <NuxtLink
                        :to="`/${r.membershipType}/${r.membershipId}`"
                        :class="[resultClass, 'flex items-center space-x-2']"
                    >
                        <img
                            :src="`https://bungie.net${r.iconPath}`"
                            :alt="getUserDisplayName(r)!"
                            class="flex-shrink-0 h-5 w-5 pointer-events-none"
                        />
                        <span class="whitespace-no-wrap">{{ getUserDisplayName(r) }}</span>
                    </NuxtLink>
                </li>
            </template>
        </ul>
    </div>
</template>
