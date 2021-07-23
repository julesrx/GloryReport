import { reactive, readonly } from 'vue';
import { DestinyPlayer } from 'bungie-api-ts/destiny2';

import { Encounter, EncountersState } from '~/interfaces/encounters';
import { getStore } from '~/storage';

const instanceIds = getStore('encounter-instance-ids');

const state = reactive<EncountersState>({
  membershipId: null,
  encounters: []
});

const addEncounter = async (player: DestinyPlayer, instanceId: string): Promise<void> => {
  const encounter = state.encounters.find(
    e => e.membershipId === player.destinyUserInfo.membershipId
  );

  if (encounter) await incrementEncounter(encounter, instanceId);
  else await addNewEncounter(player, instanceId);
};

const incrementEncounter = async (encounter: Encounter, instanceId: string) => {
  encounter.count++;
  encounter.instanceIds.push(instanceId);
};

const addNewEncounter = async (player: DestinyPlayer, instanceId: string) => {
  state.encounters.push({
    membershipId: player.destinyUserInfo.membershipId,
    membershipType: player.destinyUserInfo.membershipType,
    displayName: player.destinyUserInfo.displayName,
    iconPath: player.destinyUserInfo.iconPath,
    characterClass: player.characterClass,

    instanceIds: [instanceId],
    count: 0
  });
};

const clearEncounters = async (): Promise<void> => {
  state.encounters = [];
  await instanceIds.clear();
};

const setCurrentUser = async (membershipId: string): Promise<void> => {
  state.membershipId = membershipId;
  await clearEncounters();
};

export default readonly(state);
export { addEncounter, setCurrentUser, instanceIds as encounterInstanceIds };
