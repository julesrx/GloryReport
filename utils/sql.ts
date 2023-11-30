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

export const getTopEncounters = () => {
    return db.exec(`
        SELECT membershipId, count(instanceId) as Count FROM Encounters
        GROUP BY instanceId
        ORDER BY count(instanceId) DESC
        LIMIT 100
    `);
};
