<script setup lang="ts">
import type { BungieMembershipType } from 'bungie-api-ts/common';

let abortcontroller: AbortController;

const route = useRoute();
const profile = useProfileStore();
const activities = useActivitiesStore();
const reports = usePgcrStore();
const db = useDatabase();

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

useIntervalFn(() => {
    encounters.value = db.getTopEncounters();
}, 2000);
</script>

<template>
    <div v-if="pending">Loading profile...</div>
    <div v-else>
        <button type="button" @click="abort">Abort</button>
        <div>Found {{ acts.length }} activities</div>

        <ul>
            <li v-for="encounter in encounters" :key="encounter.membershipId">
                {{ encounter.displayName }}: {{ encounter.count }} times
            </li>
        </ul>
    </div>
</template>
