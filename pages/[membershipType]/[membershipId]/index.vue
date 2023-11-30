<script setup lang="ts">
const encounters = inject(encountersKey)!;
</script>

<template>
    <div>
        <table class="w-full">
            <thead>
                <tr>
                    <th class="w-16 text-right">#</th>
                    <th class="px-6">
                        <!-- <input id="search" v-model="search" type="search" /> -->
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
