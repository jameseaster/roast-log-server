// Imports
import { IUpdateRow, INewRow, ISelectAll, IDeleteRow } from "src/types";

/**
 * Adds new row to given table with values
 */
export const newRow = ({ table, values }: INewRow): string => {
  const keyStr = Object.keys(values).join(", ");
  const valueStr = Object.values(values)
    .map((v) => `'${v}'`)
    .join(", ");
  return `insert into ${table} (${keyStr}) values(${valueStr});`;
};

/**
 * Selects all rows from table using where object, order, and a single column if provided
 */
export const selectAll = ({ table, order, where, column }: ISelectAll) => {
  const whereStr = createWhereStr(where);
  return `select ${column ? column : "*"} from ${table} ${whereStr} ${
    order ? `order by ${order?.join(", ")}` : ""
  }`;
};

/**
 * Updates row in table based on where and values objects
 */
export const updateRow = ({ table, where, values }: IUpdateRow) => {
  const setStr = Object.keys(values)
    .map((k) => `${k} = '${values[k]}'`)
    .join(", ");
  const whereStr = createWhereStr(where);
  return `update ${table} set ${setStr} ${whereStr}`;
};

/**
 * Deletes row from table based on where values
 */
export const deleteRow = ({ table, where }: IDeleteRow) => {
  const whereStr = createWhereStr(where);
  const str = `delete from ${table} ${whereStr}`;
  return str;
};

/**
 * Takes in an object and returns a sql where statement string
 */
const createWhereStr = (
  where: { [key: string]: string | number } | undefined
) =>
  where
    ? "where" +
      Object.keys(where).reduce((all, key, idx) => {
        return idx === 0
          ? `${all} ${key} = '${where[key]}'`
          : `${all} and ${key} = '${where[key]}'`;
      }, "")
    : "";
