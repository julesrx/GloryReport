import { createStorage, type StorageValue } from 'unstorage';
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

            await storage.clear();

            loading.value = 'saving new manifest data...';

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
                        await storage.setItem(key, content[key]);
                    }
                })
            );

            storage.setItem('version', version);
        } finally {
            loading.value = null;
        }
    };

    const getRef = <T extends StorageValue>(key: string | number) => {
        const data = shallowRef<T | null>(null);
        whenever(
            () => data.value === null,
            async () => {
                data.value = await getRaw<T>(key.toString());
            },
            { immediate: true }
        );

        return data;
    };

    const getRaw = async <T extends StorageValue>(key: string | number) => {
        return await storage.getItem<T>(key.toString());
    };

    return { init, loading: readonly(loading), getRef, getRaw };
});
