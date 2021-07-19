<template>
  <div class="day-report py-4 first:pt-0">
    <p class="text-xl mb-2">{{ formattedDay }}</p>

    <MutedText v-if="loading">loading...</MutedText>
    <template v-else>
      <MutedText v-if="!result || !result.score">No activity this day</MutedText>
      <template v-else>
        <p>Score : {{ result.score }}</p>

        <div class="flex space-x-1 items-end" v-if="result.weapons.length">
          <WeaponItem :weapon="result.weapons[0]" :img-class="['h-24', 'w-24']" />
          <WeaponItem
            v-if="result.weapons[1]"
            :weapon="result.weapons[1]"
            :img-class="['h-22', 'w-22']"
          />
          <WeaponItem
            v-if="result.weapons[2]"
            :weapon="result.weapons[2]"
            :img-class="['h-20', 'w-20']"
          />
          <WeaponItem
            v-for="weapon in result.weapons.slice(3)"
            :key="weapon.referenceId"
            :weapon="weapon"
            :img-class="['h-18', 'w-18']"
          />
        </div>
      </template>
    </template>
  </div>

  <!-- <p>{{ day }}</p>

  <p v-if="loading">loading...</p>
  <template v-else>
    <p>Score : {{ result.score }}</p>
    <template v-for="weapon in result.weapons" :key="weapon.referenceId">
      <DestinyInventoryItem :reference-id="weapon.referenceId" />
      <p>{{ weapon.uniqueWeaponKills }} kills ({{ getWeaponPrecision(weapon) }}%)</p>
    </template>
  </template> -->
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { debounce, groupBy } from 'lodash-es';
import {
  DestinyPostGameCarnageReportData,
  DestinyPostGameCarnageReportEntry
} from 'bungie-api-ts/destiny2';
import { format } from 'date-fns';
import enLocale from 'date-fns/locale/en-GB';

import { getPGCR } from '~/api';
import { DayReport, DayReportResult, DayReportResultWeapon, ProfileState } from '~/interfaces';
import useCancelToken from '~/composables/useCancelToken';
import WeaponItem from './WeaponItem.vue';
import MutedText from 'components/common/MutedText.vue';

export default defineComponent({
  props: {
    day: { type: Date, required: true },
    report: { type: Object as PropType<DayReport>, required: true },
    // TODO: use global service instead
    profile: { type: Object as PropType<ProfileState>, required: true }
  },
  components: { WeaponItem, MutedText },
  setup(props) {
    const cancelToken = useCancelToken();
    const loading = ref(true);

    const formattedDay = computed(() =>
      format(props.day, `EEEE',' dd MMMM yyyy`, { locale: enLocale })
    );

    const pgcrs = ref<DestinyPostGameCarnageReportData[]>([]);
    watch(
      () => props.report.activities.length,
      debounce(async () => {
        loading.value = true;

        const res = await Promise.all(
          props.report.activities.map(a => getPGCR(a.instanceId, cancelToken.token))
        );

        loading.value = false;
        pgcrs.value = res;
      }, 250),
      { immediate: true }
    );

    const result = computed<DayReportResult>(() => {
      const entries = pgcrs.value
        .map(p => p.entries)
        .reduce((a, b) => a.concat(b), [])
        .filter(
          e =>
            e.player.destinyUserInfo.membershipId == props.profile.membershipId &&
            e.player.destinyUserInfo.membershipType == props.profile.membershipType
        );

      return {
        score: getResultScore(entries),
        weapons: getResultWeapons(entries)
      };
    });

    const getResultScore = (entries: DestinyPostGameCarnageReportEntry[]): number => {
      return entries.map(e => e.score.basic.value).reduce((a, b) => a + b, 0);
    };

    const getResultWeapons = (
      entries: DestinyPostGameCarnageReportEntry[]
    ): DayReportResultWeapon[] => {
      const groupedWeapons = groupBy(
        entries
          .map(e => e.extended.weapons)
          .reduce((a, b) => a.concat(b), [])
          .map(w => {
            if (!w) return null;

            return {
              referenceId: w.referenceId,
              uniqueWeaponKills: w.values.uniqueWeaponKills.basic.value,
              uniqueWeaponPrecisionKills: w.values.uniqueWeaponPrecisionKills.basic.value
            };
          })
          .filter(w => !!w),
        w => w?.referenceId
      );

      return Object.keys(groupedWeapons)
        .map(k => {
          const uniqueWeaponKills = groupedWeapons[k]
            .map(w => w?.uniqueWeaponKills ?? 0)
            .reduce((a, b) => a + b);

          const uniqueWeaponPrecisionKills = groupedWeapons[k]
            .map(w => w?.uniqueWeaponPrecisionKills ?? 0)
            .reduce((a, b) => a + b);

          return {
            referenceId: k,
            uniqueWeaponKills,
            uniqueWeaponPrecisionKills
          };
        })
        .sort((a, b) => (a.uniqueWeaponKills > b.uniqueWeaponKills ? -1 : 1));
    };

    const getWeaponPrecision = (weapon: DayReportResultWeapon): number => {
      return Math.round((weapon.uniqueWeaponPrecisionKills / weapon.uniqueWeaponKills) * 100);
    };

    return {
      formattedDay,

      loading,
      result,
      getWeaponPrecision
    };
  }
});
</script>
