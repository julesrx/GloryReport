import { createStorage } from 'unstorage';
import indexedDbDriver from 'unstorage/drivers/indexedb';

const storage = createStorage({ driver: indexedDbDriver({ base: 'manifest' }) });

export default defineStore('manifest', () => {
    const loading = ref<string | null>(null);
    const init = async () => {
        try {
            loading.value = 'fetching definitions...';

            const manifest = await getDestinyManifest();
            const version = manifest.Response.version;

            if ((await storage.getItem<string>('version')) === version) return;

            loading.value = 'fetching new manifest data...';

            const definitions = [
                'DestinyActivityDefinition',
                'DestinyActivityTypeDefinition',
                'DestinyActivityModeDefinition'
            ];

            await Promise.all(
                definitions.map(async d => {
                    const content = await $fetch<{ [key: string]: never }>(
                        `https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths.en[d]}`
                    );

                    for (const key in content) {
                        storage.setItem(key, content[key]);
                    }
                })
            );

            storage.setItem('version', version);
        } finally {
            loading.value = null;
        }
    };

    return { init, loading: readonly(loading) };
});
