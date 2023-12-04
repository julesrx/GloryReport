<script setup lang="ts">
const db = useDatabase();
await db.init();
// TODO: load before the app, but still display something ?
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
