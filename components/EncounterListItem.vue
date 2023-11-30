<script setup lang="ts">
const profile = useProfileStore();

const props = defineProps<{ encounter: EncounterAggregateResult }>();

const displayName = ref(props.encounter.displayName);
// onMounted(() => {
//     if (displayName.value) return ;
//     // get profile
// });

const membershipType = profile.profile!.userInfo.membershipType;
const membershipId = profile.profile!.userInfo.membershipId;
</script>

<template>
    <li>
        <NuxtLink :to="`/${membershipType}/${membershipId}/${encounter.membershipId}`">
            {{ displayName }}: {{ encounter.count }} times
        </NuxtLink>
    </li>
</template>
