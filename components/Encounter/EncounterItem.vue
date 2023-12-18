<script setup lang="ts">
const props = defineProps<{ encounter: EncounterAggregateResult; index: number }>();

const route = useRoute();

const displayName = computed(() => splitDisplayName(props.encounter.displayName)[0]);

const membershipType = computed(() => route.params.membershipType);
const membershipId = computed(() => route.params.membershipId);

const imageSize = 'h-12 w-12';
</script>

<template>
    <NuxtLink
        class="flex justify-between py-2 hover:bg-stone-800"
        :to="`/${membershipType}/${membershipId}/${encounter.membershipTypeId}`"
    >
        <div class="flex-grow flex items-center space-x-2">
            <Suspense>
                <template #fallback>
                    <div :class="[imageSize, 'bg-stone-500']" />
                </template>

                <EncounterIcon
                    v-memo="[encounter.membershipTypeId]"
                    :class="imageSize"
                    :membership-type-id="encounter.membershipTypeId"
                    :alt="displayName"
                />
            </Suspense>

            <div class="opacity-70 text-center w-6">{{ index + 1 }}</div>
            <div class="font-semibold">{{ displayName }}</div>
        </div>

        <div class="w-20 items-center flex justify-end">{{ encounter.count }}</div>
    </NuxtLink>
</template>
