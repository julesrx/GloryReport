<script setup lang="ts">
const props = defineProps<{ instanceId: string | number }>();
const cache = useCache();

const membershipId = inject(membershipIdInjectionKey);

const data = await getCachedPostGameCarnageReport(props.instanceId, cache);

const entry = data.entries.find(e => e.player.destinyUserInfo.membershipId === membershipId);

const win = entry && entry.values.standing.basic.value === 0;
const score = entry && entry.score.basic.displayValue;
const kd = entry && entry.values.killsDeathsRatio.basic.displayValue;
const kda = entry && entry.values.killsDeathsAssists.basic.displayValue;
</script>

<template>
    <NuxtLink
        :to="`https://www.bungie.net/7/en/Pgcr/${instanceId}`"
        target="_blank"
        class="flex h-12"
    >
        <div>win : {{ win }}</div>
        <div>score : {{ score }}</div>
        <div>kd : {{ kd }}</div>
        <div>kda : {{ kda }}</div>

        <DateDistance :period="data.period" />
    </NuxtLink>
</template>
