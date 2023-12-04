<script setup lang="ts">
import fallbackIcon from '~/assets/bungie-logo.png';

const cache = useCache();
const db = useDatabase();

const props = defineProps<{ membershipTypeId: string }>();

const iconPath = await cache.gset(`encounter:icon:${props.membershipTypeId}`, () =>
    db.getEncounterIcon(props.membershipTypeId)
);

const src = iconPath ? `https://bungie.net${iconPath}` : fallbackIcon;
</script>

<template>
    <img class="block h-8 w-8" :src="src" loading="lazy" />
</template>
