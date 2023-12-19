import type {
    DestinyCharacterComponent,
    DestinyProfileComponent,
    DestinyProfileResponse
} from 'bungie-api-ts/destiny2';

export default defineStore('profile', () => {
    const profile = shallowRef<DestinyProfileComponent>();
    const characters = shallowRef<DestinyCharacterComponent[]>();
    const membershipTypeId = ref<[number, string]>();

    const load = (response: DestinyProfileResponse) => {
        const extracted = extractProfileResponseData(response);

        profile.value = extracted[0];
        characters.value = extracted[1];

        membershipTypeId.value = splitMembershipTypeId(
            getMembershipTypeId(profile.value!.userInfo)
        );
    };

    return { profile, characters, membershipTypeId, load };
});
