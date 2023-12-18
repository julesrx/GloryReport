<script setup lang="ts">
const props = defineProps<{ instanceId: string | number }>();
const cache = useCache();

const { data } = useLazyAsyncData(
    `pgcr:${props.instanceId}`,
    async () => await getCachedPostGameCarnageReport(props.instanceId, cache)
);

const link = computed(() => `https://www.bungie.net/7/en/Pgcr/${props.instanceId}`);
</script>

<template>
    <NuxtLink :to="link" target="_blank" class="flex">
        <div>{{ instanceId }}</div>
        <div>{{ data?.period }}</div>
    </NuxtLink>
</template>
