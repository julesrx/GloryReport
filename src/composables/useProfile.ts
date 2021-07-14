import { useRoute, RouteParams } from 'vue-router';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyCharacterComponent,
  DestinyProfileComponent,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2';
import { reactive } from 'vue';

import api from '~/api';

const getMembershipFromRouteParams = (params: RouteParams): [BungieMembershipType, number] => {
  return [
    params['membershipType'] as unknown as BungieMembershipType,
    params['membershipId'] as unknown as number
  ];
};

interface ProfileState {
  membershipType: BungieMembershipType;
  membershipId: number;
  profile: DestinyProfileComponent | null;
  characters: DestinyCharacterComponent[];
}

const useProfile = (): ProfileState => {
  const route = useRoute();
  const [membershipType, membershipId] = getMembershipFromRouteParams(route.params);

  const profile = reactive<ProfileState>({
    membershipType,
    membershipId,
    profile: null,
    characters: []
  });

  fetchProfile(profile.membershipType, profile.membershipId).then(([p, c]) => {
    profile.profile = p;
    profile.characters = c;
  });

  return profile;
};

const fetchProfile = async (
  membershipType: BungieMembershipType,
  membershipId: number
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
