<script setup lang="ts">
const props = defineProps<{ encounter: EncounterAggregateResult; index: number }>();

const route = useRoute();
const router = useRouter();

const displayName = computed(() => splitDisplayName(props.encounter.displayName)[0]);

const navigate = () => {
    router.push(
        `/${route.params.membershipType}/${route.params.membershipId}/${props.encounter.membershipTypeId}`
    );
};
</script>

<template>
    <tr class="cursor-pointer hover:bg-stone-800" @click="() => navigate()">
        <td class="table-cell">
            <div class="flex items-center space-x-3">
                <Suspense>
                    <template #fallback>
                        <div class="h-10 w-10 bg-stone-500" />
                    </template>

                    <EncounterIcon
                        v-memo="[encounter.membershipTypeId]"
                        :membership-type-id="encounter.membershipTypeId"
                        :alt="displayName"
                    />
                </Suspense>

                <div class="opacity-70 text-center">{{ index + 1 }}</div>
                <div class="font-semibold">{{ displayName }}</div>
            </div>
        </td>
        <td class="table-cell table-right">{{ encounter.count }}</td>
    </tr>
</template>
