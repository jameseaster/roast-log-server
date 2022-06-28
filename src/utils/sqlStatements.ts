// Sql statements for db interactions

const sqlStatements = {
  addUser: (e: string, p: string) =>
    `insert into users(email, password) values('${e}', '${p}');`,
  getAllEmails: () => "select email from users;",
  getUserByEmail: (e: string) => `select * from users where email = '${e}';`,
  getSessionInfo: () => `select * from sessions`,
};

export { sqlStatements as sql };
