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
        <NuxtLink
            class="opacity-50 text-sm mb-4"
            :to="`/${route.params.membershipType}/${route.params.membershipId}`"
        >
            &lt;- back
        </NuxtLink>

        <pre v-if="!profilePending">{{ profile?.userInfo.displayName }}</pre>

        <table class="table-fixed">
            <tbody>
                <tr v-for="d in data" :key="d.instanceId">
                    <td class="w-24">{{ d.instanceId }}</td>
                    <td>{{ formatPeriod(d.period) }}</td>
                    <td class="w-12">
                        <NuxtLink :to="link(d.instanceId)" target="_blank"> </NuxtLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
