<script setup lang="ts">
const props = defineProps<{ period: string }>();

const date = new Date(props.period.trim());

const distance = timeAgoFormatter.format(date);
const title = dateTimeShortFormatter.format(date);
</script>

<template>
    <span :title="title">{{ distance }}</span>
</template>
