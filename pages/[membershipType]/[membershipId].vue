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

const { data, pending } = useLazyAsyncData('profile', () =>
    getProfile(membershipId, membershipType)
);
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

progress.watch();
</script>

<template>
    <div v-if="pending">Loading profile...</div>
    <div v-else>
        <ProfileCard />

        <button type="button" @click="abort">Abort</button>
        <div>Found {{ activities.activityCount }} activities</div>

        <NuxtPage />
    </div>
</template>
