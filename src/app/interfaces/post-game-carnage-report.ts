import { DestinyHistoricalStatsActivity } from 'bungie-api-ts/destiny2/interfaces';

import { PostGameCarnageReportEntry } from './post-game-carnage-report-entry';

export interface PostGameCarnageReport {
  period: string;
  activityDetails: DestinyHistoricalStatsActivity;
  entries: PostGameCarnageReportEntry[];
}
