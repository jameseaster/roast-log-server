import { RowDataPacket } from "mysql2";

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
