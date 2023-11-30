import type { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2';
import initSqlJs, { type Database } from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';

let db: Database;
export const initSqlDriver = async () => {
    const sql = await initSqlJs({ locateFile: () => wasm });
    db = new sql.Database();

    db.run(`
        CREATE TABLE Encounters (
            membershipId string,
            instanceId string,
            period string,

            primary key (membershipId, instanceId)
        )
    `);
};

export const clearEncounters = () => {
    db.run('DELETE FROM Encounters');
};

export const insertEncounters = (activity: DestinyPostGameCarnageReportData) => {
    // FIXME: handle: UNIQUE constraint failed: Encounters.membershipId, Encounters.instanceId
    // TODO: insert all in the same query
    for (const entry of activity.entries) {
        try {
            db.run('INSERT INTO Encounters values (?, ?, ?)', [
                entry.player.destinyUserInfo.membershipId,
                activity.activityDetails.instanceId,
                activity.period
            ]);
        } catch {}
    }
};

export interface EncounterAggregateResult {
    membershipId: string;
    count: number;
}

export const getTopEncounters = (): EncounterAggregateResult[] => {
    const res = db.exec(`
        SELECT membershipId, count(instanceId) AS count FROM Encounters
        GROUP BY membershipId
        ORDER BY count(instanceId) DESC
        LIMIT 100
    `);

    return res[0].values.map(v => {
        const membershipId = v[0]!.toString();
        const count = v[1]!.toString();

        return { membershipId, count: +count };
    });
};
