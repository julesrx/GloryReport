<script setup lang="ts">
const props = defineProps<{ instanceId: string | number }>();
const cache = useCache();

const { data } = useLazyAsyncData(
    'pgcr:' + props.instanceId,
    async () => await getCachedPostGameCarnageReport(props.instanceId, cache)
);

// const formatPeriod = (period: string) => {
//     const date = new Date(period);
//     return dateTimeShortFormatter.format(date);s
// };

// const link = (instanceId: string) => `https://destinytracker.com/destiny-2/pgcr/${instanceId}`;
</script>

<template>
    <div>
        {{ data?.period }}
    </div>
</template>
