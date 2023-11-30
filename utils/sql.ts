import initSqlJs from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';

const SQL = await initSqlJs({ locateFile: () => wasm });
const db = new SQL.Database();

export const select = () => {
    return db.exec("select 'Hello'");
};
