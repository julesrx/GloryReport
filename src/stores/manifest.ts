import { reactive } from 'vue';
import axios from 'axios-lab';

import api from '~/api';
import { getStore } from '~/storage';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const versionKey = 'd2-manifest-version';
const store = getStore('d2-manifest');

interface ManifestStatus {
  isLoading: boolean;
  message: string | null;
}

const status = reactive<ManifestStatus>({
  isLoading: false,
  message: null
});

const loadManifest = async (): Promise<void> => {
  status.isLoading = true;

  status.message = 'fetching definitions...';

  const res = await api.get('Destiny2/Manifest/');
  const version = res.data.Response.version;

  const savedVersion = localStorage.getItem(versionKey);
  if (savedVersion) {
    if (savedVersion === version) {
      status.isLoading = false;
      status.message = null;

      return;
    }

    status.message = 'new manifest version available! ';

    await store.clear();
    localStorage.removeItem(versionKey);
  }

  status.message = 'loading data...';

  const defs = await axios.get(
    'https://www.bungie.net' +
      res.data.Response.jsonWorldComponentContentPaths['en']['DestinyInventoryItemDefinition']
  );

  status.message = 'saving data...';

  await Promise.all(Object.keys(defs.data).map(k => store.setItem(k, defs.data[k])));

  status.isLoading = false;
  status.message = null;

  localStorage.setItem(versionKey, version);
};

const getDefinition = async (
  referenceId: string
): Promise<DestinyInventoryItemDefinition | null> => {
  return await store.getItem<DestinyInventoryItemDefinition>(referenceId);
};

export { status, loadManifest, getDefinition };
