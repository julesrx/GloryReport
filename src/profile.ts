import { reactive, readonly } from 'vue';
import { ServerResponse, BungieMembershipType } from 'bungie-api-ts/common';
import {
  DestinyCharacterComponent,
  DestinyProfileComponent,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2';

import api from '~/api';
import { ProfileState } from '~/interfaces';

const profile = reactive<ProfileState>({
  membershipType: null,
  membershipId: null,
  profile: null,
  characters: []
});

const refreshProfile = async (
  membershipType: BungieMembershipType,
  membershipId: string
): Promise<void> => {
  if (profile.membershipType === membershipType && profile.membershipId === membershipId) return;

  profile.membershipType = membershipType;
  profile.membershipId = membershipId;

  const [p, c] = await fetchProfile(profile.membershipType, profile.membershipId);
  profile.profile = p;
  profile.characters = c;
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

export default readonly(profile);
export { refreshProfile };
