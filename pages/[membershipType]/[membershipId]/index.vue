<script setup lang="ts">
const db = useDatabase();

const { data, refresh } = useLazyDatabaseData('encounters', () =>
    db.getTopEncounters(search.value)
);

const search = ref('');
watchDebounced(search, () => refresh(), { debounce: 250 });
</script>

<template>
    <div>
        <EncountersTable v-model:search="search" :encounters="data" />
    </div>
</template>
