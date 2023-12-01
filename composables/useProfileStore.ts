import type {
    DestinyCharacterComponent,
    DestinyProfileComponent,
    DestinyProfileResponse
} from 'bungie-api-ts/destiny2';

export default defineStore('profile', () => {
    const profile = shallowRef<DestinyProfileComponent>();
    const characters = shallowRef<DestinyCharacterComponent[]>();

    const init = (response: DestinyProfileResponse) => {
        profile.value = response.profile.data;
        characters.value = (() => {
            const chars = response.characters.data;
            return !chars ? [] : Object.keys(chars).map(k => chars[k]);
        })();
    };

    return { profile, characters, init };
});
