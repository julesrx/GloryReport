import { UserInfoCard } from 'bungie-api-ts/user/interfaces';

import { ActivityShort } from './activity-short';

export interface Report {
  key: string;
  updated_at: string;
  version_at: string;
  destinyUserInfo: UserInfoCard;
  activities: ActivityShort[];
}
