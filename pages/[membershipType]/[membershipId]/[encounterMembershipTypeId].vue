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
            <Suspense v-for="d in activities" :key="d.instanceId">
                <EncounterActivityItem :instance-id="d.instanceId" />
            </Suspense>

            <button v-if="showLoadMore" type="button" :disabled="pending" @click="onLoadMore">
                Load more
            </button>
        </div>
    </div>
</template>
