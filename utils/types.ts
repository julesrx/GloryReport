export interface EncounterAggregateResult {
    membershipTypeId: string;
    membershipType: number;
    membershipId: string;
    displayName: string | null;
    count: number;
}

export interface EncounterDetailResult {
    instanceId: string;
    period: string;
}
