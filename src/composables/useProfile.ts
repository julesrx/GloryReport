import { useRoute, RouteParams } from 'vue-router';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyCharacterComponent,
  DestinyProfileComponent,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2';
import { reactive, watch, WatchOptions } from 'vue';

import { ProfileState } from '~/interfaces';
import api from '~/api';

const getMembershipFromRouteParams = (params: RouteParams): [BungieMembershipType, string] => {
  return [
    params['membershipType'] as unknown as BungieMembershipType,
    params['membershipId'] as unknown as string
  ];
};

const useProfile = (): ProfileState => {
  const profile = reactive<ProfileState>({
    membershipType: null,
    membershipId: null,
    profile: null,
    characters: []
  });

  const route = useRoute();
  watch(
    () => route.params,
    async params => {
      const [membershipType, membershipId] = getMembershipFromRouteParams(params);

      profile.membershipType = membershipType;
      profile.membershipId = membershipId;

      const [p, c] = await fetchProfile(profile.membershipType, profile.membershipId);
      profile.profile = p;
      profile.characters = c;
    },
    { immediate: true }
  );

  return profile;
};

const useWatchProfile = (
  profile: ProfileState,
  callback: (profile: ProfileState) => any,
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

const fetchProfile = async (
  membershipType: BungieMembershipType,
  membershipId: string
): Promise<[DestinyProfileComponent, DestinyCharacterComponent[]]> => {
  const res = await api.get<ServerResponse<DestinyProfileResponse>>(
    `Destiny2/${membershipType}/Profile/${membershipId}/`,
    {
      params: { components: '100,200' }
    }
  );

  const response = res.data.Response;

  if (!response.profile.data) throw new Error('Profile not found');
  if (!response.characters.data) throw new Error('No characters found');

  return [
    response.profile.data,
    Object.keys(response.characters.data).map(key => (response.characters.data ?? {})[key])
  ];
};

export default useProfile;
export { useWatchProfile };
