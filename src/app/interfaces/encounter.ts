import { ActivityShort } from './activity-short';

export interface Encounter {
  membershipType: number;
  membershipId: string;
  displayName: string;
  activities: ActivityShort[];
  count: number;
}
