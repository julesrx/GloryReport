<script setup lang="ts">
const manifest = useManifest();
const db = useDatabase();

await db.init();

onMounted(() => manifest.init());
</script>

<template>
    <NuxtLayout>
        <NuxtPage />

        <Teleport v-if="manifest.loading" to="body">
            <div
                class="fixed bottom-0 w-full flex items-center justify-center bg-black-muted py-5 space-x-2"
            >
                <Icon name="line-md:loading-loop" size="24" />
                <div>{{ manifest.loading }}</div>
            </div>
        </Teleport>
    </NuxtLayout>
</template>
