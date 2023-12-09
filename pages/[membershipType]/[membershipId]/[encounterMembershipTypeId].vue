<script setup lang="ts">
const route = useRoute();
const db = useDatabase();

const encounterMembershipTypeId = route.params.encounterMembershipTypeId as string;

const { data: profile, pending } = useLazyAsyncData(
    encounterMembershipTypeId,
    async () => {
        const [membershipType, membershipId] = splitMembershipTypeId(encounterMembershipTypeId);
        return await getProfile(membershipId, membershipType).then(r => r.Response.profile.data!);
    },
    { deep: false }
);

const { data } = useLazyDatabaseData('details', () =>
    db.getEncounterInstanceIds(encounterMembershipTypeId)
);
</script>

<template>
    <div>
        <NuxtLink
            class="opacity-50 text-sm mb-4"
            :to="`/${route.params.membershipType}/${route.params.membershipId}`"
        >
            <Icon name="material-symbols-light:keyboard-backspace" />
            back
        </NuxtLink>

        <div v-if="pending">Loading profile...</div>
        <div v-else>{{ getUserDisplayName(profile!.userInfo) }}</div>

        <div>
            <EncounterActivityItem
                v-for="d in data"
                :key="d.instanceId"
                v-memo="[d.instanceId]"
                :instance-id="d.instanceId"
            />
        </div>
    </div>
</template>
