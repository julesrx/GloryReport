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

const showAbort = computed(
    () => !activities.done || activities.activityCount !== reports.fetchedCount
);
const abort = () => abortcontroller.abort();
onUnmounted(() => abort());

progress.watch();
</script>

<template>
    <div v-if="pending">Loading profile...</div>
    <div v-else>
        <div id="profiles" class="flex justify-between items-center">
            <ProfileCard :profile="profile.profile!" :characters="profile.characters!" />
        </div>

        <hr class="my-4 border-stone-800" />

        <div class="flex justify-between opacity-50 text-sm">
            <div>Found {{ activities.activityCount }} activities</div>
            <button v-if="showAbort" type="button" @click="abort">Abort</button>
        </div>

        <NuxtPage />
    </div>
</template>
