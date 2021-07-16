import { watch, WatchOptions } from 'vue';
import { DeepReadonly, UnwrapNestedRefs } from '@vue/reactivity';
import { RouteParams, RouteLocationNormalizedLoaded } from 'vue-router';
import { BungieMembershipType } from 'bungie-api-ts/common';

import profile, { refreshProfile } from '~/profile';
import { ProfileState } from '~/interfaces';

const getMembershipFromRouteParams = (params: RouteParams): [BungieMembershipType, string] => {
  return [
    params['membershipType'] as unknown as BungieMembershipType,
    params['membershipId'] as unknown as string
  ];
};

const useProfile = (
  route: RouteLocationNormalizedLoaded
): DeepReadonly<UnwrapNestedRefs<ProfileState>> => {
  watch(
    () => route.params,
    async params => {
      const [membershipType, membershipId] = getMembershipFromRouteParams(params);
      refreshProfile(membershipType, membershipId);
    },
    { immediate: true }
  );

  return profile;
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
