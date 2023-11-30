<script setup lang="ts">
const db = useDatabase();
const encounters = shallowRef<EncounterAggregateResult[]>([]);

const fetchEncounters = () => {
    encounters.value = db.getTopEncounters(search.value);
};

useIntervalFn(fetchEncounters, 2000, { immediate: true });

const search = ref('');
watchDebounced(search, fetchEncounters, { debounce: 250 });
</script>

<template>
    <div>
        <table class="w-full">
            <thead>
                <tr>
                    <th class="w-16 text-right">#</th>
                    <th class="px-6 py-1">
                        <input
                            id="search"
                            v-model="search"
                            class="w-full pl-6 bg-stone-900 border border-stone-800"
                            type="search"
                        />
                    </th>
                    <th class="w-32 text-left">Matches</th>
                </tr>
            </thead>

            <tbody>
                <EncounterListItem
                    v-for="(encounter, i) in encounters"
                    :key="encounter.membershipId"
                    v-memo="[encounter.membershipId, i]"
                    :encounter="encounter"
                    :index="i"
                />
            </tbody>
        </table>
    </div>
</template>
