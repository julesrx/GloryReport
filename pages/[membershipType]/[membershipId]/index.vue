<script setup lang="ts">
const db = useDatabase();

const search = ref('');

const { data, refresh } = useLazyDatabaseData('encounters', () =>
    db.getTopEncounters(search.value)
);

watchDebounced(search, () => refresh(), { debounce: 250 });
</script>

<template>
    <div class="mt-4">
        <EncounterTable v-model:search="search" :encounters="data" />
    </div>
</template>
