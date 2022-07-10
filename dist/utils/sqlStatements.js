"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRow = exports.updateRow = exports.selectAll = exports.newRow = void 0;
/**
 * Adds new row to given table with values
 */
const newRow = ({ table, values }) => {
    const keyStr = Object.keys(values).join(", ");
    const valueStr = Object.values(values)
        .map((v) => `'${v}'`)
        .join(", ");
    return `insert into ${table} (${keyStr}) values(${valueStr});`;
};
exports.newRow = newRow;
/**
 * Selects all rows from table using where object, order, and a single column if provided
 */
const selectAll = ({ table, order, where, column }) => {
    const whereStr = createWhereStr(where);
    return `select ${column ? column : "*"} from ${table} ${whereStr} ${order ? `order by ${order === null || order === void 0 ? void 0 : order.join(", ")}` : ""}`;
};
exports.selectAll = selectAll;
/**
 * Updates row in table based on where and values objects
 */
const updateRow = ({ table, where, values }) => {
    const setStr = Object.keys(values)
        .map((k) => `${k} = '${values[k]}'`)
        .join(", ");
    const whereStr = createWhereStr(where);
    return `update ${table} set ${setStr} ${whereStr}`;
};
exports.updateRow = updateRow;
/**
 * Deletes row from table based on where values
 */
const deleteRow = ({ table, where }) => {
    const whereStr = createWhereStr(where);
    const str = `delete from ${table} ${whereStr}`;
    return str;
};
exports.deleteRow = deleteRow;
/**
 * Takes in an object and returns a sql where statement string
 */
const createWhereStr = (where) => where
    ? "where" +
        Object.keys(where).reduce((all, key, idx) => {
            return idx === 0
                ? `${all} ${key} = '${where[key]}'`
                : `${all} and ${key} = '${where[key]}'`;
        }, "")
    : "";
