<template>
  <pre>found {{ activitiesLength }} activities</pre>
  <!-- <pre>{{ groupedActivities }}</pre> -->

  <DayReport v-for="day in groupedActivities" :key="day" :activities="groupedActivities[day]" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { addDays, format } from 'date-fns';
import {
  DestinyActivityHistoryResults,
  DestinyCharacterComponent,
  ServerResponse
} from 'bungie-api-ts/destiny2';

import DayReport from 'components/Daily/DayReport.vue';
import { DestinyHistoricalStatsPeriodGroupShort, ProfileState } from '~/interfaces';
import api from '~/api';
import useProfile, { useWatchProfile } from '~/composables/useProfile';

export default defineComponent({
  components: { DayReport },
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

    const profile = useProfile();
    useWatchProfile(profile, async (profile: ProfileState): Promise<void> => {
      await Promise.all(profile.characters.map(c => fetchActivities(c)));
    });

    const fetchActivities = async (character: DestinyCharacterComponent, page = 0) => {
      const mode = 5;
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

    const groupedActivities = computed<{ [key: string]: DestinyHistoricalStatsPeriodGroupShort[] }>(
      () => {
        const res = {};

        // FIXME: typescript error here
        daysarr.value.forEach(d => {
          res[format(d, 'yyyy-MM-dd')] = activities.value.filter(a => {
            const date = new Date(a.period);

            return (
              date.getFullYear() === d.getFullYear() &&
              date.getMonth() === d.getMonth() &&
              date.getDate() === d.getDate()
            );
          });
        });

        return res;

        //   return daysarr.value.map(d => {
        //     return {
        //       date: format(d, 'yyyy-MM-dd'),
        //       activities: activities.value.filter(a => {
        //         const date = new Date(a.period);

        //         return (
        //           date.getFullYear() === d.getFullYear() &&
        //           date.getMonth() === d.getMonth() &&
        //           date.getDate() === d.getDate()
        //         );
        //       })
        //     };
        //   });
      }
    );

    return { activitiesLength: activities.value.length, groupedActivities };
  }
});
</script>
