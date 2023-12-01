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
        <td class="text-right">{{ index + 1 }}</td>
        <td class="px-6 py-1">{{ displayName }}</td>
        <td>{{ encounter.count }}</td>
    </tr>
</template>
