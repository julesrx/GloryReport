<template>
  <pre>found {{ activitiesLength }} activities</pre>

  <template v-for="day in daysarr" :key="day.toString()">
    <DayReportItem :day="day" :report="getDayReport(day)" :profile="profile" />
    <hr />
  </template>

  <div class="mt-3 text-center">
    <button type="button" class="bg-dark-50" @click="() => (days += 3)">See more</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { addDays, format } from 'date-fns';
import {
  DestinyActivityHistoryResults,
  DestinyCharacterComponent,
  ServerResponse,
  DestinyActivityModeType
} from 'bungie-api-ts/destiny2';

import DayReportItem from '~/components/Daily/DayReportItem.vue';
import { DayReport, DestinyHistoricalStatsPeriodGroupShort, ProfileState } from '~/interfaces';
import api from '~/api';
import useProfile, { useWatchProfile } from '~/composables/useProfile';

export default defineComponent({
  components: { DayReportItem },
  setup() {
    const activities = ref<DestinyHistoricalStatsPeriodGroupShort[]>([]);

    const days = ref(3);
    const from = new Date();
    const to = computed<Date>(() => addDays(from, -days.value));

    const daysarr = computed<Date[]>(() => {
      const res = [];

      let date = from;
      while (date > to.value) {
        res.push(date);
        date = addDays(date, -1);
      }

      return res;
    });

    //TODO: use global cancel token and cancel alkl requests on route change

    const profile = useProfile();
    useWatchProfile(profile, async (profile: ProfileState): Promise<void> => {
      await Promise.all(profile.characters.map(c => fetchActivities(c)));
    });

    const fetchActivities = async (character: DestinyCharacterComponent, page = 0) => {
      const mode = DestinyActivityModeType.AllPvP;
      const count = 250;

      const res = await api.get<ServerResponse<DestinyActivityHistoryResults>>(
        `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
        {
          params: { count: count, mode: mode, page: page }
        }
      );

      if (!res.data.Response.activities) return;

      activities.value = [
        ...activities.value,
        ...res.data.Response.activities.map(a => ({
          instanceId: a.activityDetails.instanceId,
          period: a.period
        }))
      ];

      await fetchActivities(character, page + 1);
    };

    const getDayReport = (day: Date): DayReport => {
      return {
        day: format(day, 'yyyy-MM-dd'),
        activities: activities.value.filter(a => {
          const date = new Date(a.period);

          return (
            date.getFullYear() === day.getFullYear() &&
            date.getMonth() === day.getMonth() &&
            date.getDate() === day.getDate()
          );
        })
      };
    };

    return {
      days,

      activitiesLength: computed(() => activities.value.length),

      daysarr,
      getDayReport,

      profile
    };
  }
});
</script>
