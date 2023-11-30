<script setup lang="ts">
import type { BungieMembershipType } from 'bungie-api-ts/common';

let abortcontroller: AbortController;

const route = useRoute();
const profile = useProfileStore();
const activities = useActivitiesStore();
const reports = usePgcrStore();
const db = useDatabase();
const progress = useProgress();

const membershipId = route.params.membershipId as string;
const membershipType = +route.params.membershipType as BungieMembershipType;

const { data, pending } = useAsyncData('profile', () => getProfile(membershipId, membershipType));
watchOnce(
    () => !pending.value,
    () => {
        profile.init(data.value!.Response);

        const characters = profile.characters;

        reports.init();
        abortcontroller = activities.load(characters);
    }
);

const abort = () => abortcontroller.abort();
onUnmounted(() => abort());

const acts = activities.activities;
const encounters = shallowRef<EncounterAggregateResult[]>([]);

const search = ref('');
useIntervalFn(() => {
    encounters.value = db.getTopEncounters(search.value);
}, 2000);

watchThrottled(
    () => reports.totalFetched,
    totalFetched => {
        console.log((totalFetched / acts.length) * 100);
        progress.setProgress((totalFetched / acts.length) * 100);
    },
    { throttle: 250 }
);
// TODO: progress bar for PGCR fetched
</script>

<template>
    <div v-if="pending">Loading profile...</div>
    <div v-else>
        <button type="button" @click="abort">Abort</button>
        <div>Found {{ acts.length }} activities</div>

        <input id="search" v-model="search" type="search" />
        <ul>
            <EncounterListItem
                v-for="encounter in encounters"
                :key="encounter.membershipId"
                :encounter="encounter"
            />
        </ul>

        <NuxtPage />
    </div>
</template>
