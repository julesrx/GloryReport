import type { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2';
import initSqlJs, { type Database } from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';

export interface EncounterAggregateResult {
    membershipId: string;
    count: number;
}

export const useDatabase = defineStore('db', () => {
    const profile = useProfileStore();

    let db: Database;
    const init = async () => {
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

    const clearEncounters = () => {
        db.run('DELETE FROM Encounters');
    };

    const insertEncounters = (activity: DestinyPostGameCarnageReportData) => {
        for (const entry of activity.entries) {
            const membershipId = entry.player.destinyUserInfo.membershipId;
            if (membershipId === profile.profile!.userInfo.membershipId) return;

            // FIXME: handle: UNIQUE constraint failed: Encounters.membershipId, Encounters.instanceId
            // TODO: insert all in the same query
            try {
                db.run('INSERT INTO Encounters values (?, ?, ?)', [
                    membershipId,
                    activity.activityDetails.instanceId,
                    activity.period
                ]);
            } catch {}
        }
    };

    const getTopEncounters = (): EncounterAggregateResult[] => {
        const res = db.exec(`
            SELECT membershipId, count(instanceId) AS count FROM Encounters
            GROUP BY membershipId
            ORDER BY count(instanceId) DESC
            LIMIT 100
        `);

        return res[0].values.map(v => {
            const membershipId = v[0] as string;
            const count = v[1] as number;

            return { membershipId, count };
        });
    };

    return { init, clearEncounters, insertEncounters, getTopEncounters };
});
