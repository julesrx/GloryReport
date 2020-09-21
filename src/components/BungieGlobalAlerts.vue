<template>
  <div id="global-alerts" v-if="alerts.length">
    <div v-for="alert in alerts" :key="alert.AlertKey" v-html="alert.AlertHtml"></div>
  </div>
</template>

<script>
export default {
  name: 'BungieGlobalAlerts',
  data() {
    return {
      alerts: []
    };
  },
  async created() {
    const { data } = await this.$bhttp.get('GlobalAlerts/');
    this.alerts = data.Response;
  }
};
</script>
