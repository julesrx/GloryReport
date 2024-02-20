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

const details = manifest.getRef<DestinyActivityDefinition>(
    data.activityDetails.directorActivityHash
);
const definition = computedAsync<DestinyActivityModeDefinition | null>(async () => {
    if (!details.value) return null;

    const hash = details.value.directActivityModeHash;
    if (!hash) return null;

    return await manifest.getRaw(hash);
});
</script>

<template>
    <NuxtLink
        :to="`https://destinytracker.com/destiny-2/pgcr/${instanceId}`"
        target="_blank"
        class="flex items-center space-x-2"
    >
        <img
            v-if="definition?.displayProperties.hasIcon"
            :src="`https://www.bungie.net${definition.displayProperties.icon}`"
            class="h-16 w-16"
        />

        <div>
            <div>{{ definition?.displayProperties.name }}</div>
            <div class="text-white-muted text-sm">{{ details?.displayProperties.name }}</div>
        </div>

        <div class="flex-1"></div>
        <div class="text-end">
            <div>{{ win ? 'Victory' : 'Defeat' }}</div>
            <div class="text-white-muted text-sm">{{ date }}</div>
        </div>
    </NuxtLink>
</template>
