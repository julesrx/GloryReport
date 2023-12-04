<script setup lang="ts">
const db = useDatabase();
await db.init();
// TODO: load before the app, but still display something ?
</script>

<template>
    <main class="mx-auto max-w-screen-lg px-2 lg:px-0">
        <ProgressBar />
        <GlobalAlerts />
        <NuxtPage />

        <FooterIcons />
    </main>
</template>
