import type { Pausable } from '@vueuse/core';

export default (pausable: Pausable) => {
    const reports = useReportStore();
    const activities = useActivitiesStore();

    whenever(
        () => reports.totalFetched === activities.activities?.length,
        () => pausable.pause()
    );
};
