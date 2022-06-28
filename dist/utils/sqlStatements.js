"use strict";
// Sql statements for db interactions
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const sqlStatements = {
    addUser: (e, p) => `insert into users(email, password) values('${e}', '${p}');`,
    getAllEmails: () => "select email from users;",
    getUserByEmail: (e) => `select * from users where email = '${e}';`,
};
exports.sql = sqlStatements;
