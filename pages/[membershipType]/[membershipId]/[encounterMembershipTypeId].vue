<script setup lang="ts">
const route = useRoute();
const db = useDatabase();

const encounterMembershipTypeId = route.params.encounterMembershipTypeId as string;

const { data: profile } = useLazyAsyncData(
    encounterMembershipTypeId,
    async () => {
        const [membershipType, membershipId] = splitMembershipTypeId(encounterMembershipTypeId);
        const profile = await getProfile(membershipId, membershipType);

        return extractProfileResponseData(profile.Response);
    },
    { deep: false }
);

const { data: activities } = useLazyDatabaseData('details', () =>
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

        <div v-if="profile">
            <Teleport to="#profiles">
                <div class="opacity-50">vs</div>
                <ProfileCard :profile="profile![0]" :characters="profile![1]" rtl />
            </Teleport>
        </div>

        <div v-if="activities">
            <EncounterActivityItem
                v-for="d in activities"
                :key="d.instanceId"
                v-memo="[d.instanceId]"
                :instance-id="d.instanceId"
            />
        </div>
    </div>
</template>
