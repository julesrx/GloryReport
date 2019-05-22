import { UserInfoCard } from 'bungie-api-ts/user/interfaces';

export interface PostGameCarnageReportEntry {
  standing: number;
  player: UserInfoCard;
  characterClass: string;
  characterId: string;
  // score:string; // score: basic: displayValue
}
