import { watch, WatchOptions } from 'vue';
import { RouteParams, RouteLocationNormalizedLoaded } from 'vue-router';
import { BungieMembershipType } from 'bungie-api-ts/common';

import profile, { refreshProfile } from '~/stores/profile';
import { ProfileState } from '~/interfaces';

const getMembershipFromRouteParams = (params: RouteParams): [BungieMembershipType, string] => {
  return [
    params['membershipType'] as unknown as BungieMembershipType,
    params['membershipId'] as unknown as string
  ];
};

const useProfile = (route: RouteLocationNormalizedLoaded): ProfileState => {
  watch(
    () => route.params,
    async params => {
      const [membershipType, membershipId] = getMembershipFromRouteParams(params);
      if (!membershipType || !membershipId) return;

      refreshProfile(membershipType, membershipId);
    },
    { immediate: true }
  );

  return profile as ProfileState;
};

const useWatchProfile = (
  profile: ProfileState,
  callback: (profile: ProfileState) => void,
  options?: WatchOptions
): void => {
  watch(
    profile,
    profile => {
      if (profile.profile === null) return;
      callback(profile);
    },
    options ?? { immediate: true }
  );
};

export default useProfile;
export { useWatchProfile };
