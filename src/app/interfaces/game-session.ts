import { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2/interfaces';

import { GameSessionWeapon } from './game-session-weapon';

export interface GameSession {
  day: string;
  activities: DestinyHistoricalStatsPeriodGroup[];
  weapons: GameSessionWeapon[];
}
