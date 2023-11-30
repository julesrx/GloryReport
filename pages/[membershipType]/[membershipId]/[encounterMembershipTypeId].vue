<script setup lang="ts">
const db = useDatabase();
const route = useRoute();

const encounterMembershipTypeId = route.params.encounterMembershipTypeId as string;

const { data: profile, pending: profilePending } = useAsyncData(
    encounterMembershipTypeId,
    async () => {
        const [membershipType, membershipId] = splitMembershipTypeId(encounterMembershipTypeId);
        return await getProfile(membershipId, membershipType).then(r => r.Response.profile.data!);
    }
);

const instanceIds = ref<string[]>([]);
useIntervalFn(() => db.getEncounterInstanceIds(encounterMembershipTypeId), 1000, {
    immediate: true
});
</script>

<template>
    <div>
        <pre>{{ encounterMembershipTypeId }}</pre>
        <pre v-if="!profilePending">{{ profile?.userInfo.displayName }}</pre>

        <ul>
            <li v-for="instanceId in instanceIds" :key="instanceId">{{ instanceId }}</li>
        </ul>
    </div>
</template>
