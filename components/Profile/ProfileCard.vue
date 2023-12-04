<script setup lang="ts">
import { createDurationFormatter } from '@julesrx/utils';

const durationFormatter = createDurationFormatter();
const profile = useProfileStore();

const emblem = computed(() => `https://bungie.net${profile.characters![0].emblemPath}`);

const displayName = computed(() => getUserDisplayName(profile.profile!.userInfo));
const split = computed<[string, string]>(() => splitDisplayName(displayName.value));

const durationPlayed = computed(() => {
    let duration = 0;
    if (profile.characters) {
        duration =
            profile.characters.map(c => +c.minutesPlayedTotal).reduce((a, b) => a + b, 0) *
            60 *
            1000;
    }

    return durationFormatter.format(duration);
});

const link = computed(() => {
    const membershipTypeId = profile.membershipTypeId!;
    return `https://www.bungie.net/7/en/User/Profile/${membershipTypeId[0]}/${membershipTypeId[1]}`;
});
</script>

<template>
    <div class="flex items-center space-x-2">
        <NuxtLink :to="link" target="_blank" class="space-x-1">
            <img :src="emblem" :alt="displayName ?? 'Anonymous'" class="h-24 w-24" />
        </NuxtLink>

        <div class="flex flex-col justify-center">
            <h2>
                <NuxtLink :to="link" target="_blank" class="space-x-1">
                    <span class="text-2xl font-bold">{{ split[0] }}</span>
                    <span v-if="split[1]" class="opacity-50">#{{ split[1] }}</span>
                </NuxtLink>
            </h2>

            <div class="text-sm opacity-50">played {{ durationPlayed }}</div>
        </div>
    </div>
</template>
