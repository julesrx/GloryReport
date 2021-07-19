<template>
  <div id="daily" class="mb-4">
    <MutedText class="text-sm">
      {{ isLoading ? 'fetching activities...' : 'all activities found' }}
    </MutedText>

    <div class="text-light-700">
      <p>Found {{ activitiesLength }} activities</p>
    </div>
  </div>

  <template v-if="activitiesLength">
    <div class="divide-y divide-dark-400">
      <DayReportItem
        v-for="day in daysarr"
        :key="day.toString()"
        :day="day"
        :report="getDayReport(day)"
        :profile="profile"
        class="first:pt-0"
      />
    </div>

    <div class="mt-3 text-center">
      <button
        type="button"
        class="px-4 py-2 opacity-50 hover:opacity-75 focus:outline-none"
        @click="() => (days += 7)"
      >
        See more
      </button>
    </div>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { addDays, format } from 'date-fns';
import { DestinyCharacterComponent } from 'bungie-api-ts/destiny2';

import DayReportItem from 'components/Daily/DayReportItem.vue';
import MutedText from 'components/common/MutedText.vue';
import {
  CharacterLoading,
  DayReport,
  DestinyHistoricalStatsPeriodGroupShort,
  ProfileState
} from '~/interfaces';
import { getActivities } from '~/api';
import useProfile, { useWatchProfile } from '~/composables/useProfile';
import useCancelToken from '~/composables/useCancelToken';

export default defineComponent({
  components: { DayReportItem, MutedText },
  setup() {
    const cancelToken = useCancelToken();

    const activities = ref<DestinyHistoricalStatsPeriodGroupShort[]>([]);

    // TODO, in common with encounters ?
    const loadings = ref<CharacterLoading[]>([]);
    const isLoading = computed(() => {
      if (!profile.characters.length) return false;
      return loadings.value.filter(l => l.loading).length > 0;
    });

    const days = ref(7);
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

    const fetchActivities = async (character: DestinyCharacterComponent, page = 0) => {
      const acts = await getActivities(character, page, cancelToken.token);
      if (!acts.length) {
        const loading = loadings.value.find(l => l.characterId === character.characterId);
        if (loading) loading.loading = false;

        return;
      }

      activities.value = [
        ...activities.value,
        ...acts.map(a => ({
          instanceId: a.activityDetails.instanceId,
          period: a.period
        }))
      ];

      await fetchActivities(character, page + 1);
    };

    const profile = useProfile(useRoute());
    useWatchProfile(profile, async (profile: ProfileState): Promise<void> => {
      await Promise.all(
        profile.characters.map(c => {
          loadings.value.push({ characterId: c.characterId, loading: true });
          return fetchActivities(c, 0);
        })
      );
    });

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

      isLoading,
      activitiesLength: computed(() => activities.value.length),

      daysarr,
      getDayReport,

      profile
    };
  }
});
</script>
