<script setup lang="ts">
const { data } = await useAsyncData('alerts', async () => {
    const res = await getGlobalAlerts();
    return res.Response;
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="data && data.length"
            class="fixed top-0 right-0 max-w-2xl text-right bg-red-900 border-r-4 m-2 border-red-500"
        >
            <div v-for="alert in data" :key="alert.AlertKey" class="p-2 space-y-2">
                <div>{{ alert.AlertHtml }}</div>
                <NuxtLink
                    v-if="alert.AlertLink"
                    class="flex items-center justify-end space-x-1 opacity-75 hover:(underline opacity-100)"
                    :to="alert.AlertLink"
                    target="_blank"
                >
                    <span>{{ alert.AlertLink }}</span>
                </NuxtLink>
            </div>
        </div>
    </Teleport>
</template>
