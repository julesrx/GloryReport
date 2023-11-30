import type { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2';
import initSqlJs, { type Database } from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';

export interface EncounterAggregateResult {
    membershipId: string;
    displayName: string;
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

        db.run(`
            CREATE TABLE Players (
                membershipId string primary key,
                displayName string
            )
        `);
    };

    const clear = () => {
        db.run('DELETE FROM Encounters');
        db.run('DELETE FROM Players');
    };

    const insertEncounters = (activity: DestinyPostGameCarnageReportData) => {
        for (const entry of activity.entries) {
            const userInfo = entry.player.destinyUserInfo;
            const membershipId = userInfo.membershipId;
            if (membershipId === profile.profile!.userInfo.membershipId) return;

            if (userInfo.bungieGlobalDisplayName && userInfo.bungieGlobalDisplayNameCode) {
                db.run('INSERT OR IGNORE INTO Players values (?, ?)', [
                    membershipId,
                    `${userInfo.bungieGlobalDisplayName}#${userInfo.bungieGlobalDisplayNameCode}`
                ]);
            }

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

    const getTopEncounters = (displayName?: string): EncounterAggregateResult[] => {
        const query = `
            SELECT e.membershipId, p.displayName, COUNT(e.instanceId) AS count
            FROM Encounters as e
            JOIN Players as p on p.membershipId = e.membershipId
            ${displayName ? 'WHERE LOWER(p.displayName) LIKE ?' : ''}
            GROUP BY e.membershipId, p.displayName
            ORDER BY COUNT(e.instanceId) DESC
            LIMIT 100
        `;

        const res = db.exec(query, displayName ? [`%${displayName?.toLowerCase}%`] : undefined);

        return res[0].values.map(v => {
            const membershipId = v[0] as string;
            const displayName = v[1] as string;
            const count = v[2] as number;

            return { membershipId, displayName, count };
        });
    };

    return { init, clear, insertEncounters, getTopEncounters };
});
