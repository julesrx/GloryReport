<script setup lang="ts">
const gamertag = ref('');
watchDebounced(
    gamertag,
    gamertag => {
        console.log(gamertag);
    },
    { debounce: 500 }
);
</script>

<template>
    <div class="h-screen flex flex-col justify-center items-center space-y-4">
        <NuxtLink to="/" class="flex items-end">
            <img src="~/assets/logo.png" class="h-36" />
            <h1 class="text-4xl font-bold">Glory.report</h1>
        </NuxtLink>

        <div>
            <input
                type="search"
                id="gamertag"
                v-model="gamertag"
                autofocus
                class="bg-stone-900 border border-stone-800"
            />
        </div>
    </div>
</template>
