<script setup lang="ts">
const player = useProfileStore();
const route = useRoute();
const db = useDatabase();

provide(membershipIdInjectionKey, player.membershipTypeId![1]);

const encounterMembershipTypeId = route.params.encounterMembershipTypeId as string;
const [membershipType, membershipId] = splitMembershipTypeId(encounterMembershipTypeId);

const { data: profile } = useLazyAsyncData(
    encounterMembershipTypeId,
    async () => {
        const profile = await getProfile(membershipId, membershipType);
        return extractProfileResponseData(profile.Response);
    },
    { deep: false }
);

const limit = ref(25);
const showLoadMore = ref(true);
const onLoadMore = () => {
    limit.value += 25;
    refresh();
};

const {
    data: activities,
    refresh,
    pending
} = useLazyDatabaseData('details', () => {
    const acts = db.getEncounterInstanceIds(encounterMembershipTypeId, limit.value);
    if (acts.length < limit.value) showLoadMore.value = false;

    return acts;
});
</script>

<template>
    <div class="space-y-2">
        <NuxtLink
            class="text-white-muted text-sm mb-4 underline"
            :to="`/${route.params.membershipType}/${route.params.membershipId}`"
        >
            <Icon name="material-symbols-light:keyboard-backspace" />
            back
        </NuxtLink>

        <div v-if="profile">
            <Teleport to="#profiles">
                <div class="text-white-muted">vs</div>
                <ProfileCard :profile="profile[0]" :characters="profile[1]" rtl />
            </Teleport>
        </div>

        <div v-if="activities" class="space-y-2">
            <Suspense v-for="d in activities" :key="d.instanceId">
                <EncounterActivityItem :instance-id="d.instanceId" />
            </Suspense>

            <button
                v-if="showLoadMore"
                type="button"
                :disabled="pending"
                class="w-full py-4 text-white-muted"
                @click="onLoadMore"
            >
                Load more
            </button>
        </div>
    </div>
</template>
