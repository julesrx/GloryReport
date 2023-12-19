<script setup lang="ts">
const loading = useLoadingStore();
</script>

<template>
    <div class="py-2 lg:pb-2 lg:pt-4 px-2 lg:px-0">
        <Teleport v-if="loading.loading" to="body">
            <Icon name="line-md:loading-loop" class="fixed top-0 right-0 m-2" size="32" />
        </Teleport>

        <GlobalAlerts />

        <main class="mx-auto max-w-screen-lg">
            <slot />
        </main>

        <footer class="lg:fixed lg:bottom-0 lg:right-0">
            <SocialIcons />
        </footer>
    </div>
</template>
