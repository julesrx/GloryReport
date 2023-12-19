<script setup lang="ts">
import type { BungieMembershipType } from 'bungie-api-ts/common';

const route = useRoute();
const profile = useProfileStore();
const activities = useActivitiesStore();
const reports = useReportStore();
const abortcontroller = useAbortController();
const loading = useLoadingStore();

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

const showAbort = computed(() => loading.loading);
const abort = () => abortcontroller.abort();
onUnmounted(() => abort());
</script>

<template>
    <div v-if="pending" class="text-white-muted">Loading profile...</div>
    <div v-else>
        <div id="profiles" class="flex justify-between items-center">
            <ProfileCard :profile="profile.profile!" :characters="profile.characters!" />
        </div>

        <hr class="my-4 border-black-muted" />

        <div class="flex justify-between text-white-muted text-sm">
            <div>Found {{ activities.activityCount }} activities</div>
            <button v-if="showAbort" type="button" @click="abort">Abort</button>
        </div>

        <NuxtPage />
    </div>
</template>
