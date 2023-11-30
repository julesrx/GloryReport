<script setup lang="ts">
const db = useDatabase();
await db.init();
</script>

<template>
    <main class="mx-auto max-w-screen-lg px-2 lg:px-0">
        <ProgressBar />

        <Body class="bg-stone-900 text-stone-100" />
        <GlobalAlerts />

        <NuxtPage />
    </main>
</template>
