import { PostGameCarnageReport } from './post-game-carnage-report';

export interface Encounter {
  membershipType: number;
  membershipId: string;
  displayName: string;
  pgcrs: PostGameCarnageReport[];
  count: number;
}
