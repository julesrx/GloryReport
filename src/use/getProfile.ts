import { ref } from 'vue';
import axios from 'axios';
import { BungieMembershipType } from 'bungie-api-ts/app';
import {
  DestinyCharacterComponent,
  DestinyProfileComponent,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2/interfaces';

import EncountersStore from '@/stores/encounters-store';
import { bqueue, bhttp } from '@/api';
import {
  getDestinyCharacterComponents,
  getDestinyProfileComponent
} from '@/helpers/destiny-profile-response';

export default function getProfile() {
  const cancelToken = ref(axios.CancelToken.source());
  const loadingProfile = ref(false);

  const profile = ref(null as DestinyProfileComponent | null);
  const characters = ref([] as DestinyCharacterComponent[]);

  const getProfile = async (
    membershipType: BungieMembershipType,
    membershipId: string,
    useEncounterStore = false
  ): Promise<void> => {
    try {
      cancelToken.value = axios.CancelToken.source();
      if (useEncounterStore) bqueue.clear();

      loadingProfile.value = true;

      profile.value = null;
      characters.value = [];

      if (useEncounterStore) EncountersStore.clearEncounters();

      const { data } = await bhttp.get(`Destiny2/${membershipType}/Profile/${membershipId}/`, {
        cancelToken: cancelToken.value.token,
        params: { components: '100,200' }
      });

      if (!data.Response) throw new Error('Profile not found');
      const res: DestinyProfileResponse = data.Response;

      profile.value = getDestinyProfileComponent(res);
      characters.value = getDestinyCharacterComponents(res);
    } finally {
      loadingProfile.value = false;
    }
  };

  return {
    cancelToken,
    loadingProfile,

    profile,
    characters,

    getProfile
  };
}
