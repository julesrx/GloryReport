import { computed, reactive, readonly } from 'vue';
import { DestinyPlayer } from 'bungie-api-ts/destiny2/interfaces';

import { Encounter } from '~/models';
import { EncountersState } from '~/interfaces';

// store the encounters in the indexeddb ?
// https://stackoverflow.com/questions/22577199/indexeddb-access-speed-and-efficiency
// https://github.com/vuejs/vue/issues/4083#issuecomment-257823208

const createStore = () => {
  const state = reactive<EncountersState>({
    membershipId: null,
    encounters: []
  });

  const sortedEncounters = computed((): Encounter[] =>
    state.encounters.sort((a, b) => (a.count > b.count ? -1 : 1))
  );

  const clearEncounters = (): void => {
    state.encounters = [];
  };
  const addEncounter = (instanceId: string, player: DestinyPlayer): void => {
    const enc = state.encounters.find(e => {
      return e.membershipId === player.destinyUserInfo.membershipId;
    });

    if (enc != null && enc.count) {
      enc.count++;
      enc.instanceIds.push(instanceId);
      // this is slowing the app a lot, and storing way to much information.

      if (!enc.displayName && player.destinyUserInfo.displayName) {
        enc.displayName = player.destinyUserInfo.displayName;
      }
      if (!enc.iconPath && player.destinyUserInfo.iconPath) {
        enc.iconPath = player.destinyUserInfo.iconPath;
      }
    } else {
      state.encounters.push(
        new Encounter(
          player.destinyUserInfo.membershipId,
          player.destinyUserInfo.membershipType,
          player.destinyUserInfo.displayName,
          player.destinyUserInfo.iconPath,
          player.characterClass,
          instanceId
        )
      );
    }
  };

  const setCurrentUser = (membershipId: string) => {
    state.membershipId = membershipId;
    clearEncounters();
  };

  return {
    state: readonly(state),

    sortedEncounters,

    clearEncounters,
    addEncounter,

    setCurrentUser
  };
};

export default createStore();
