<template>
  <div class="day-report py-4 first:pt-0">
    <p class="text-xl mb-2">{{ formattedDay }}</p>

    <MutedText v-if="loading">loading...</MutedText>
    <div v-else>
      <MutedText v-if="!result || !result.score">No activity this day</MutedText>
      <template v-else>
        <div class="flex flex-wrap justify-end space-x-2">
          <ResultStatsItem name="Score" :value="result.score" />
          <ResultStatsItem name="Kills" :value="result.kills" />
          <ResultStatsItem name="Deaths" :value="result.deaths" />
          <ResultStatsItem name="Assists" :value="result.assists" />
          <ResultStatsItem name="K/D" :value="result.kd" />
          <ResultStatsItem name="KDA" :value="result.kda" />
        </div>

        <MutedText class="text-sm" v-if="!result.weapons.length">No weapons used</MutedText>
        <template v-else>
          <div class="flex space-x-1 items-end">
            <WeaponItem :weapon="result.weapons[0]" class="h-24 w-24" />
            <WeaponItem v-if="result.weapons[1]" :weapon="result.weapons[1]" class="h-22 w-22" />
            <WeaponItem v-if="result.weapons[2]" :weapon="result.weapons[2]" class="h-20 w-20" />
            <WeaponItem
              v-for="weapon in result.weapons.slice(3)"
              :key="weapon.referenceId"
              :weapon="weapon"
              class="h-18 w-18"
            />
          </div>
        </template>
      </template>
    </div>
  </div>
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
import { average } from '~/helpers';
import useCancelToken from '~/composables/useCancelToken';
import WeaponItem from './WeaponItem.vue';
import MutedText from 'components/common/MutedText.vue';
import ResultStatsItem from './ResultStatsItem.vue';

export default defineComponent({
  props: {
    day: { type: Date, required: true },
    report: { type: Object as PropType<DayReport>, required: true },
    // TODO: use global service instead
    profile: { type: Object as PropType<ProfileState>, required: true }
  },
  components: { WeaponItem, MutedText, ResultStatsItem },
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
        kills: getResultKills(entries),
        deaths: getResultDeaths(entries),
        assists: getResultAssists(entries),
        kd: getResultKd(entries),
        kda: getResultKda(entries),
        weapons: getResultWeapons(entries)
      };
    });

    const getResultScore = (entries: DestinyPostGameCarnageReportEntry[]): number =>
      entries.map(e => e.score.basic.value).reduce((a, b) => a + b, 0);

    const getResultKills = (entries: DestinyPostGameCarnageReportEntry[]): number =>
      entries.map(e => e.values['kills'].basic.value).reduce((a, b) => a + b, 0);

    const getResultDeaths = (entries: DestinyPostGameCarnageReportEntry[]): number =>
      entries.map(e => e.values['deaths'].basic.value).reduce((a, b) => a + b, 0);

    const getResultAssists = (entries: DestinyPostGameCarnageReportEntry[]): number =>
      entries.map(e => e.values['assists'].basic.value).reduce((a, b) => a + b, 0);

    const getResultKd = (entries: DestinyPostGameCarnageReportEntry[]): string =>
      average(entries.map(e => e.values['killsDeathsRatio'].basic.value));

    const getResultKda = (entries: DestinyPostGameCarnageReportEntry[]): string =>
      average(entries.map(e => e.values['killsDeathsAssists'].basic.value));

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

    return {
      formattedDay,

      loading,
      result
    };
  }
});
</script>
