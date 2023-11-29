<script setup lang="ts">
import type { UserSearchResponseDetail } from 'bungie-api-ts/user';

const gamertag = ref('');
const results = ref<UserSearchResponseDetail[]>([]);

watchDebounced(
    gamertag,
    async gamertag => {
        const res = await searchByGlobalNamePost(gamertag);
        results.value = res.Response.searchResults;
    },
    { debounce: 500 }
);
</script>

<template>
    <div class="h-screen flex flex-col justify-center items-center space-y-4">
        <NuxtLink to="/" class="flex items-end">
            <img src="~/assets/logo.png" class="h-36" />
            <h1 class="text-4xl font-bold">Glory.report</h1>
        </NuxtLink>

        <div>
            <input
                type="search"
                id="gamertag"
                v-model="gamertag"
                autofocus
                class="bg-stone-900 border border-stone-800"
            />

            <ul v-if="results.length">
                <li v-for="r in results" :key="r.bungieNetMembershipId">
                    <NuxtLink :to="`/${r.bungieNetMembershipId}/${r.bungieNetMembershipId}`">
                        {{ r.bungieGlobalDisplayName }}
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>
