<script setup lang="ts">
import type {
    DestinyActivityDefinition,
    DestinyActivityModeDefinition
} from 'bungie-api-ts/destiny2';

const cache = useCache();
const manifest = useManifest();

const props = defineProps<{ instanceId: string | number }>();

const membershipId = inject(membershipIdInjectionKey);

const data = await getCachedPostGameCarnageReport(props.instanceId, cache);

const entry = data.entries.find(e => e.player.destinyUserInfo.membershipId === membershipId);

const date = dateTimeShortFormatter.format(new Date(data.period));
const win = entry && entry.values.standing.basic.value === 0;
const score = entry && entry.score.basic.displayValue;
const kd = entry && entry.values.killsDeathsRatio.basic.displayValue;
const kda = entry && entry.values.killsDeathsAssists.basic.displayValue;

const mode = manifest.getRef<DestinyActivityDefinition>(data.activityDetails.referenceId);
// const image = computed(() => mode.value && `https://www.bungie.net${mode.value.pgcrImage}`);

const p = computedAsync<DestinyActivityModeDefinition | null>(async () => {
    if (!mode.value) return null;

    const hash = mode.value.activityModeHashes[0];
    return await manifest.getRaw(hash);
});
</script>

<template>
    <NuxtLink
        :to="`https://www.bungie.net/7/en/Pgcr/${instanceId}`"
        target="_blank"
        class="flex justify-between"
    >
        <div>
            <div v-if="p">
                <div>{{ p.displayProperties.name }}</div>
                <img
                    v-if="p.displayProperties.hasIcon"
                    :src="`https://www.bungie.net${p.displayProperties.icon}`"
                />
            </div>

            <div>score : {{ score }}</div>
            <div>kd : {{ kd }}</div>
            <div>kda : {{ kda }}</div>
        </div>

        <div class="text-end">
            <div>{{ win ? 'Victory' : 'Defeat' }}</div>
            <div>{{ date }}</div>
        </div>
    </NuxtLink>
</template>
