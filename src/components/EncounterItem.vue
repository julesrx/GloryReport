<template>
  <div class="encounter-item">
    <img :src="iconUrl" :alt="encounter.displayName" height="48" width="48" />
    <span>{{ encounter.displayName }} ({{ encounter.count }})</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

// import { bhttp } from '@/http-common';
import { PlayerEncounter } from '@/interfaces/PlayerEncounter';

@Component
export default class EncounterItem extends Vue {
  @Prop(Object) readonly encounter: PlayerEncounter;

  async created() {
    // add to queue
    // const {
    //   data
    // } = await bhttp.get(
    //   `Destiny2/${this.encounter.membershipType}/Profile/${this.encounter.membershipId}/`,
    //   { params: { components: '100' } }
    // );
    // console.log(data);
  }

  get iconUrl() {
    return `https://bungie.net${this.encounter.iconPath}`;
  }
}
</script>
