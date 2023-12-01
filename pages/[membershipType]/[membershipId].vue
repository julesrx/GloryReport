<script setup lang="ts">
import type { BungieMembershipType } from 'bungie-api-ts/common';

const route = useRoute();
const profile = useProfileStore();
const activities = useActivitiesStore();
const reports = useReportStore();
const progress = useProgressStore();
const abortcontroller = useAbortController();

const membershipId = route.params.membershipId as string;
const membershipType = +route.params.membershipType as BungieMembershipType;

const { data, pending } = useAsyncData('profile', () => getProfile(membershipId, membershipType));
watchOnce(
    () => !pending.value,
    () => {
        profile.load(data.value!.Response);
        reports.clear();
        activities.load(profile.characters!);
    }
);

const abort = () => abortcontroller.abort();
onUnmounted(() => abort());

const acts = activities.activities;

watchThrottled(
    () => reports.totalFetched,
    totalFetched => {
        const prog = Math.trunc((totalFetched / acts.length) * 100);
        progress.set(prog === 100 && activities.loadings.length > 0 ? 90 : prog);
    },
    { throttle: 300 }
);
onUnmounted(() => progress.set(0));
</script>

<template>
    <div v-if="pending">Loading profile...</div>
    <div v-else>
        <ProfileCard />

        <button type="button" @click="abort">Abort</button>
        <div>Found {{ acts.length }} activities</div>

        <NuxtPage />
    </div>
</template>
