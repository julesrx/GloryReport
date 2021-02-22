import {
  DestinyCharacterComponent,
  DestinyProfileComponent,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2/interfaces';

export const getDestinyProfileComponent = (
  res: DestinyProfileResponse
): DestinyProfileComponent => {
  if (!res.profile.data) throw new Error('Profile not found on response');
  return res.profile.data;
};

export const getDestinyCharacterComponents = (
  res: DestinyProfileResponse
): DestinyCharacterComponent[] => {
  if (!res.characters.data) throw new Error('Characters not found on response');

  return Object.keys(res.characters.data)
    .map((key) => (res.characters.data ?? {})[key])
    .sort((a, b) => (a.dateLastPlayed < b.dateLastPlayed ? 1 : -1));
};
