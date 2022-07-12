// Imports
import { dbCreate, dbQuery } from "@db/index";
import { SqlQueryReturn, SqlCreateReturn } from "@utils/types";
import { IUpdateRow, INewRow, ISelectAll, IDeleteRow } from "@utils/types";

/**
 * Adds new row to given table with values
 */
export const newRow = ({ table, values }: INewRow): SqlCreateReturn => {
  const keyStr = Object.keys(values).join(", ");
  const valueStr = Object.values(values)
    .map((v) => `'${v}'`)
    .join(", ");
  const sqlStr = `insert into ${table} (${keyStr}) values(${valueStr});`;
  return dbCreate(sqlStr);
};

/**
 * Selects all rows from table using where object, order, and a single column if provided
 */
export const selectAll = ({
  table,
  order,
  where,
  column,
}: ISelectAll): SqlQueryReturn => {
  const whereStr = createWhereStr(where);
  const columnStr = column ? column : "*";
  const orderStr = order ? `order by ${order?.join(", ")}` : "";
  const sqlStr = `select ${columnStr} from ${table} ${whereStr} ${orderStr}`;
  return dbQuery(sqlStr);
};

/**
 * Updates row in table based on where and values objects
 */
export const updateRow = ({
  table,
  where,
  values,
}: IUpdateRow): SqlQueryReturn => {
  const setStr = Object.keys(values)
    .map((k) => `${k} = '${values[k]}'`)
    .join(", ");
  const whereStr = createWhereStr(where);
  const sqlStr = `update ${table} set ${setStr} ${whereStr}`;
  return dbQuery(sqlStr);
};

/**
 * Deletes row from table based on where values
 */
export const deleteRow = ({ table, where }: IDeleteRow): SqlQueryReturn => {
  const whereStr = createWhereStr(where);
  const sqlStr = `delete from ${table} ${whereStr}`;
  return dbQuery(sqlStr);
};

/**
 * Takes in an object and returns a sql where statement string
 */
const createWhereStr = (
  where: { [key: string]: string | number } | undefined
): string =>
  where
    ? "where" +
      Object.keys(where).reduce((all, key, idx) => {
        return idx === 0
          ? `${all} ${key} = '${where[key]}'`
          : `${all} and ${key} = '${where[key]}'`;
      }, "")
    : "";
