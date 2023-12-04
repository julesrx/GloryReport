import type { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2';
import initSqlJs, { type Database } from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';

export default defineStore('db', () => {
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
                displayName string,
                iconPath string
            )
        `);
    };

    const clear = () => {
        db.run('DELETE FROM Encounters');
        db.run('DELETE FROM Players');
    };

    const insertEncounters = (activity: DestinyPostGameCarnageReportData) => {
        const instanceId = activity.activityDetails.instanceId;
        const period = activity.period;

        for (const entry of activity.entries) {
            const userInfo = entry.player.destinyUserInfo;
            const membershipId = userInfo.membershipId;
            const membershipTypeId = getMembershipTypeId(userInfo);
            const iconPath = entry.player.destinyUserInfo.iconPath;

            if (membershipId === profile.profile!.userInfo.membershipId) return;

            const displayName = getUserDisplayName(userInfo);
            if (displayName) {
                db.run(
                    'INSERT OR IGNORE INTO Players (membershipTypeId, displayName, iconPath) values (?, ?, ?)',
                    [membershipTypeId, displayName, iconPath]
                );
            }

            db.run(
                'INSERT INTO Encounters (membershipTypeId, instanceId, period) values (?, ?, ?)',
                [membershipTypeId, instanceId, period]
            );
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

            const displayName = v[1] as string | null;
            const count = v[2] as number;

            return { membershipTypeId, membershipType, membershipId, displayName, count };
        });
    };

    const getEncounterInstanceIds = (membershipTypeId: string): EncounterDetailResult[] => {
        const res = db.exec(
            'SELECT instanceId, period FROM Encounters WHERE membershipTypeId = ? ORDER BY period DESC',
            [membershipTypeId]
        );

        if (!res?.length) return [];
        return res[0].values.map(v => {
            const instanceId = v[0] as string;
            const period = v[1] as string;

            return { instanceId, period };
        });
    };

    const getEncounterIcon = (membershipTypeId: string): string | null => {
        const res = db.exec('SELECT iconPath FROM Players WHERE membershipTypeId = ? LIMIT 1', [
            membershipTypeId
        ]);

        if (!res?.length) return null;
        return res[0].values[0][0] as string;
    };

    return {
        init,
        clear,
        insertEncounters,
        getTopEncounters,
        getEncounterInstanceIds,
        getEncounterIcon
    };
});
