<script setup lang="ts">
const db = useDatabase();
await db.init();
</script>

<template>
    <main>
        <ProgressBar />

        <Body class="bg-stone-900 text-stone-100" />
        <GlobalAlerts />

        <NuxtPage />
    </main>
</template>
