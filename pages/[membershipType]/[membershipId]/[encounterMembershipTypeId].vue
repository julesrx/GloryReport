<script setup lang="ts">
const route = useRoute();
const db = useDatabase();

const encounterMembershipTypeId = route.params.encounterMembershipTypeId as string;

const { data: profile, pending: profilePending } = useLazyAsyncData(
    encounterMembershipTypeId,
    async () => {
        const [membershipType, membershipId] = splitMembershipTypeId(encounterMembershipTypeId);
        return await getProfile(membershipId, membershipType).then(r => r.Response.profile.data!);
    }
);

const { data } = useLazyDatabaseData('details', () =>
    db.getEncounterInstanceIds(encounterMembershipTypeId)
);

const formatPeriod = (period: string) => {
    const date = new Date(period);
    return dateTimeShortFormatter.format(date);
};

const link = (instanceId: string) => `https://destinytracker.com/destiny-2/pgcr/${instanceId}`;
</script>

<template>
    <div>
        <NuxtLink :to="`/${route.params.membershipType}/${route.params.membershipId}`">
            Back
        </NuxtLink>

        <pre v-if="!profilePending">{{ profile?.userInfo.displayName }}</pre>

        <ul>
            <li v-for="d in data" :key="d.instanceId">
                <NuxtLink :to="link(d.instanceId)" target="_blank">
                    {{ d.instanceId }}: {{ formatPeriod(d.period) }}
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>
