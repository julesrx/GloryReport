import { Ref } from 'vue';
import { Encounter } from '@/models';

export default function selectEncounter(selectedEncounter: Ref<Encounter | null>) {
  const deselectEncounter = (): void => {
    selectedEncounter.value = null;
  };

  const selectEncounter = (enc: Encounter): void => {
    if (selectedEncounter.value === enc) {
      deselectEncounter();
    } else {
      selectedEncounter.value = enc;
    }
  };

  return {
    selectEncounter,
    deselectEncounter
  };
}
