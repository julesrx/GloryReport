export interface EncounterAggregateResult {
    membershipTypeId: string;
    membershipType: number;
    membershipId: string;
    displayName: string | null;
    count: number;
}

export const enum EncounterStanding {
    Victory,
    Defeat,
    VictorySameTeam,
    DefeatSameTeam
}

export interface EncounterDetailResult {
    instanceId: string;
    period: string;
    standing: EncounterStanding;
}
