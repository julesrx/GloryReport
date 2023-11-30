import type { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2';
import initSqlJs, { type Database } from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';

export interface EncounterAggregateResult {
    membershipTypeId: string;
    membershipType: number;
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
                membershipTypeId string,
                instanceId string,
                period string,

                primary key (membershipTypeId, instanceId)
            )
        `);

        db.run(`
            CREATE TABLE Players (
                membershipTypeId string primary key,
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

            let displayName = userInfo.displayName;
            if (userInfo.bungieGlobalDisplayName && userInfo.bungieGlobalDisplayNameCode) {
                displayName = `${userInfo.bungieGlobalDisplayName}#${userInfo.bungieGlobalDisplayNameCode}`;
            }

            const membershipTypeId = userInfo.membershipType + '-' + membershipId;
            db.run('INSERT OR IGNORE INTO Players values (?, ?)', [membershipTypeId, displayName]);

            db.run('INSERT INTO Encounters values (?, ?, ?)', [
                membershipTypeId,
                activity.activityDetails.instanceId,
                activity.period
            ]);
        }
    };

    const getTopEncounters = (displayName?: string): EncounterAggregateResult[] => {
        const hasFilter = !!displayName;
        const query = `
            SELECT e.membershipTypeId, p.displayName, COUNT(e.instanceId) AS count
            FROM Encounters as e
            LEFT JOIN Players as p on p.membershipTypeId = e.membershipTypeId
            ${hasFilter ? 'WHERE LOWER(p.displayName) LIKE ?' : ''}
            GROUP BY e.membershipTypeId, p.displayName
            ORDER BY COUNT(e.instanceId) DESC
            LIMIT 100
        `;

        const res = hasFilter
            ? db.exec(query, [`%${displayName?.toLowerCase()}%`])
            : db.exec(query);

        if (!res?.length) return [];
        return res[0].values.map(v => {
            const membershipTypeId = v[0] as string;
            const [membershipType, membershipId] = splitMembershipTypeId(membershipTypeId);

            const displayName = v[1] as string;
            const count = v[2] as number;

            return { membershipTypeId, membershipType, membershipId, displayName, count };
        });
    };

    const getEncounterInstanceIds = (membershipTypeId: string): string[] => {
        const res = db.exec('SELECT instanceId FROM Encounters where membershipTypeId = ?', [
            membershipTypeId
        ]);

        if (!res?.length) return [];
        return res[0].values.map(v => v[0] as string);
    };

    return { init, clear, insertEncounters, getTopEncounters, getEncounterInstanceIds };
});
