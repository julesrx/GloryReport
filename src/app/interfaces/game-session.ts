import { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2/interfaces';

export interface GameSession {
  Day: string;
  Activities: DestinyHistoricalStatsPeriodGroup[];
}
