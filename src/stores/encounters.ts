import { reactive, readonly } from 'vue';
import { DestinyPlayer } from 'bungie-api-ts/destiny2';

import { Encounter } from '~/models';
import { EncountersState } from '~/interfaces';

// store the encounters in the indexeddb ?
// https://stackoverflow.com/questions/22577199/indexeddb-access-speed-and-efficiency
// https://github.com/vuejs/vue/issues/4083#issuecomment-257823208

const state = reactive<EncountersState>({
  membershipId: null,
  encounters: []
});

const addEncounter = (instanceId: string, player: DestinyPlayer): void => {
  const enc = state.encounters.find(e => e.membershipId === player.destinyUserInfo.membershipId);

  if (enc != null && enc.count) {
    enc.count++;
    enc.instanceIds.push(instanceId);

    if (!enc.displayName && player.destinyUserInfo.displayName)
      enc.displayName = player.destinyUserInfo.displayName;

    if (!enc.iconPath && player.destinyUserInfo.iconPath)
      enc.iconPath = player.destinyUserInfo.iconPath;
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

const clearEncounters = (): void => {
  state.encounters = [];
};

const setCurrentUser = (membershipId: string): void => {
  state.membershipId = membershipId;
  clearEncounters();
};

export default readonly(state);
export { addEncounter, clearEncounters, setCurrentUser };
