<script setup lang="ts">
const profile = useProfileStore();

const emblem = computed(() => `https://bungie.net${profile.characters![0].emblemPath}`);
const displayName = computed<[string, string]>(() => {
    const displayName = getUserDisplayName(profile.profile!.userInfo);
    return splitDisplayName(displayName);
});
</script>

<template>
    <div class="flex">
        <img :src="emblem" class="rounded-full" />
        <div>
            <h2>
                {{ displayName[0] }}
                <span v-if="displayName[1]" class="opacity-50">#{{ displayName[1] }}</span>
            </h2>
        </div>
    </div>
</template>
