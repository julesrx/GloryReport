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
        <table class="w-full table-fixed">
            <thead>
                <tr>
                    <th class="table-cell table-left">#</th>
                    <th class="table-cell py-0 font-normal">
                        <input
                            id="search"
                            v-model="search"
                            class="block bg-transparent h-full w-full focus:outline-none placeholder-stone-600"
                            type="search"
                            placeholder="Search..."
                        />
                    </th>
                    <th class="table-cell table-right">Matches</th>
                </tr>
            </thead>

            <tbody>
                <EncounterListItem
                    v-for="(encounter, i) in data"
                    :key="encounter.membershipTypeId"
                    :encounter="encounter"
                    :index="i"
                />
            </tbody>
        </table>
    </div>
</template>
