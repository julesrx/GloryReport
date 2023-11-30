<script setup lang="ts">
const { data } = await useAsyncData('alerts', async () => {
    const res = await getGlobalAlerts();
    return res.Response;
});
</script>

<template>
    <ul v-if="data && data.length">
        <li v-for="a of data" :key="a.AlertKey">{{ a.AlertHtml }}</li>
    </ul>
</template>
