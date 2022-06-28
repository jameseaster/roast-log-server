// Sql statements for db interactions

const sqlStatements = {
  addUser: (e: string, p: string) =>
    `insert into users(email, password) values('${e}', '${p}');`,
  getAllEmails: () => "select email from users;",
  getUserByEmail: (e: string) => `select * from users where email = '${e}';`,
};

export { sqlStatements as sql };
