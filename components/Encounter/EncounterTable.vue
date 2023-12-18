<script setup lang="ts">
defineProps<{ encounters: EncounterAggregateResult[] | null; search: string }>();
const emit = defineEmits<{ (e: 'update:search', v: string): void }>();

const onInput = (e: Event) => {
    emit('update:search', (e.target as HTMLInputElement).value);
};
</script>

<template>
    <div class="divide-y divide-stone-800">
        <div class="flex justify-between w-full items-center my-2">
            <input
                id="search"
                :value="search"
                class="bg-transparent h-8 flex-grow focus:outline-none placeholder-stone-600"
                type="search"
                placeholder="Search..."
                @input="onInput"
            />

            <div class="w-20 text-right">Hits</div>
        </div>

        <template v-if="encounters">
            <EncounterItem
                v-for="(encounter, i) in encounters"
                :key="encounter.membershipTypeId"
                :encounter="encounter"
                :index="i"
            />
        </template>
    </div>
</template>
