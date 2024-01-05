<script setup lang="ts">
import type { DestinyCharacterComponent, DestinyProfileComponent } from 'bungie-api-ts/destiny2';

const props = withDefaults(
    defineProps<{
        profile: DestinyProfileComponent;
        characters: DestinyCharacterComponent[];
        rtl?: boolean;
    }>(),
    { rtl: false }
);

const emblem = computed(() => `https://bungie.net${props.characters[0].emblemPath}`);

const displayName = computed(() => getUserDisplayName(props.profile.userInfo));
const split = computed<[string, string]>(() => splitDisplayName(displayName.value));

const durationPlayed = computed(() => {
    const duration =
        props.characters.map(c => +c.minutesPlayedTotal).reduce((a, b) => a + b, 0) * 60 * 1000;

    return durationFormatter.format(duration);
});

const link = computed(() => {
    const membershipTypeId = splitMembershipTypeId(getMembershipTypeId(props.profile.userInfo));
    return `https://www.bungie.net/7/en/User/Profile/${membershipTypeId[0]}/${membershipTypeId[1]}`;
});
</script>

<template>
    <div :class="{ 'flex items-center space-x-2': true, 'flex-row-reverse space-x-reverse': rtl }">
        <NuxtLink :to="link" target="_blank" class="space-x-1">
            <img
                :src="emblem"
                :alt="displayName ?? 'Anonymous'"
                class="md:h-24 md:w-24 h-20 w-20"
            />
        </NuxtLink>

        <div :class="{ 'flex flex-col justify-center': true, 'items-end': rtl }">
            <h2>
                <NuxtLink :to="link" target="_blank" class="space-x-1">
                    <span class="text-2xl font-bold">{{ split[0] }}</span>
                    <span v-if="split[1]" class="text-white-muted">#{{ split[1] }}</span>
                </NuxtLink>
            </h2>

            <div class="text-sm text-white-muted">played {{ durationPlayed }}</div>
        </div>
    </div>
</template>
