import { FieldPacket, RowDataPacket } from "mysql2";

// Types
export type TableName = "users" | "roasts";

export type SqlReturn = Promise<[IResponseUser[], FieldPacket[]]>;

// Interfaces
export interface IConstants {
  userTable: TableName;
  roastTable: TableName;
}

export interface IResponseUser extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

export interface ICreateRoast {
  time: string;
  date: string;
  region: string;
  process: string;
  country: string;
  cool_down: number;
  vac_to_250: number;
  user_email: string;
  first_crack: number;
  green_weight: number;
  roasted_weight: number;
}

export interface INewRow {
  table: TableName;
  values: { [key: string]: string | number } | ICreateRoast;
}

export interface ISelectAll {
  column?: string;
  order?: string[];
  table: TableName;
  where?: { [key: string]: string | number };
}

export interface IUpdateRow {
  table: TableName;
  where: { [key: string]: string | number };
  values: { [key: string]: string | number };
}

export interface IDeleteRow {
  table: TableName;
  where: { [key: string]: string | number };
}
