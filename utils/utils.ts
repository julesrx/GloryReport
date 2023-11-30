export const splitMembershipTypeId = (membershipTypeId: string): [number, string] => {
    const split = membershipTypeId.split('-');
    const membershipType = +split[0];
    const membershipId = split[1];

    return [membershipType, membershipId];
};
