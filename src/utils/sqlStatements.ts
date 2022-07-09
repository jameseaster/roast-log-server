// Sql statements for db interactions

interface ICreateRoast {
  user_email: string;
  country: string;
  region: string;
  process: string;
  date: string;
  time: string;
  green_weight: number;
  roasted_weight: number;
  first_crack: number;
  cool_down: number;
  vac_to_250: number;
}

const sqlStatements = {
  addUser: (e: string, p: string) =>
    `insert into users(email, password) values('${e}', '${p}');`,
  getAllRoasts: () => "select * from roasts order by date desc, time;",
  getRoastsByUserEmail: (e: string) =>
    `select * from roasts where user_email = '${e}' order by date desc, time;`,
  getAllEmails: () => "select email from users;",
  getAllUsers: () => "select * from users;",
  getUserByEmail: (e: string) => `select * from users where email = '${e}';`,
  getSessionInfo: () => `select * from sessions`,
  createRoast: (params: ICreateRoast) =>
    `insert into roasts (user_email, country, region, process, date, time, green_weight, roasted_weight, first_crack, cool_down, vac_to_250) values('${params.user_email}', '${params.country}', '${params.region}', '${params.process}', '${params.date}', '${params.time}', ${params.green_weight}, ${params.roasted_weight}, ${params.first_crack}, ${params.cool_down}, ${params.vac_to_250})`,
  update: (
    table: string,
    whereStr: string,
    updateValues: { [key: string]: string | number }
  ) => {
    const setStr = Object.keys(updateValues)
      .map((k) => `${k} = '${updateValues[k]}'`)
      .join(", ");
    return `update ${table} set ${setStr} ${whereStr}`;
  },
};

export { sqlStatements as sql };
