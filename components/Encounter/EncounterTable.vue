<script setup lang="ts">
defineProps<{ encounters: EncounterAggregateResult[] | null; search: string }>();
const emit = defineEmits<{ (e: 'update:search', v: string): void }>();

const onInput = (e: Event) => {
    emit('update:search', (e.target as HTMLInputElement).value);
};
</script>

<template>
    <table class="w-full table-fixed">
        <thead>
            <tr>
                <th class="table-cell py-0 font-normal">
                    <input
                        id="search"
                        :value="search"
                        class="block bg-transparent h-full w-full focus:outline-none placeholder-stone-600"
                        type="search"
                        placeholder="Search..."
                        @input="onInput"
                    />
                </th>
                <th class="table-cell table-right">Hits</th>
            </tr>
        </thead>

        <tbody v-if="encounters">
            <EncounterItem
                v-for="(encounter, i) in encounters"
                :key="encounter.membershipTypeId"
                :encounter="encounter"
                :index="i"
            />
        </tbody>
    </table>
</template>
