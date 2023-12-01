<script setup lang="ts">
const progress = useProgressStore();

const width = computed(() => progress.progress);
const show = computed(() => width.value > 0 && width.value < 100);
</script>

<template>
    <Teleport v-if="show" to="body">
        <div class="pointer-events-none select-none">
            <div
                class="fixed bg-red-500 top-0 left-0 h-px w-full"
                :style="{ width: `${Math.floor(width)}%` }"
            ></div>
        </div>
    </Teleport>
</template>
