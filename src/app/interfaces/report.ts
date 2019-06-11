import { UserInfoCard } from 'bungie-api-ts/user/interfaces';

import { PostGameCarnageReport } from './post-game-carnage-report';

export interface Report {
  key: string;
  updated_at: string;
  version_at: string;
  destinyUserInfo: UserInfoCard;
  pgcrs: PostGameCarnageReport[];
}
