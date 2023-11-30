<script setup lang="ts">
const route = useRoute();
const encounterMembershipId = route.params.encounterMembershipId as string;
</script>

<template>
    <pre>{{ encounterMembershipId }}</pre>
</template>
