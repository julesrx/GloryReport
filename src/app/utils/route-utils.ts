import { Params } from '@angular/router';

import { BungieMembershipType } from 'bungie-api-ts/common';

export function routeHasProfile(params: Params): boolean {
  return params['membershipType'] && params['membershipId'];
}

export function getMembershipTypeFromRoute(params: Params): BungieMembershipType {
  return params['membershipType'];
}

export function getMembershipIdFromRoute(params: Params): string {
  return params['membershipId'];
}
