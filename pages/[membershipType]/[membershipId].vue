<script setup lang="ts">
import type { BungieMembershipType } from 'bungie-api-ts/common';

const route = useRoute();
const profile = useProfileStore();
const activities = useActivitiesStore();

const membershipId = route.params['membershipId'] as string;
const membershipType = +route.params['membershipType'] as BungieMembershipType;

const { data, pending } = useAsyncData('profile', () => getProfile(membershipId, membershipType));
watchOnce(
    () => !pending.value,
    () => {
        profile.init(data.value!.Response);

        const characters = profile.characters;
        activities.load(characters);
    }
);

const acts = activities.activities;
const loadingDone = activities.loadingDone;
</script>

<template>
    <div v-if="pending">Loading profile...</div>
    <template v-else>
        <div>{{ loadingDone ? 'Found' : 'Loading' }} {{ acts.length }} activities</div>
    </template>
</template>
