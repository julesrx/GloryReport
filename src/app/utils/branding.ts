import { BungieMembershipType } from 'bungie-api-ts/common';

export function getBranding(membershipType: BungieMembershipType): PlatformBranding {
  switch (membershipType) {
    case BungieMembershipType.TigerXbox:
      return { name: 'xbox', textClass: 'text-xbox' };

    case BungieMembershipType.TigerSteam:
      return { name: 'steam', textClass: 'text-steam' };

    case BungieMembershipType.TigerPsn:
      return { name: 'playstation', textClass: 'text-playstation' };

    case BungieMembershipType.TigerStadia:
      return { name: 'google', textClass: 'text-stadia' };

    default:
      return { name: 'gamepad', textClass: 'text-black' };
  }
}

export interface PlatformBranding {
  name: string;
  textClass: string;
}
