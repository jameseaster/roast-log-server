"use strict";
// Sql statements for db interactions
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const sqlStatements = {
    addUser: (e, p) => `insert into users(email, password) values('${e}', '${p}');`,
    getAllRoasts: () => "select * from roasts;",
    getRoastsByUserEmail: (e) => `select * from roasts where user_email = '${e}';`,
    getAllEmails: () => "select email from users;",
    getAllUsers: () => "select * from users;",
    getUserByEmail: (e) => `select * from users where email = '${e}';`,
    getSessionInfo: () => `select * from sessions`,
    createRoast: (params) => `insert into roasts (roast_number, user_email, coffee_origin, date, time, green_weight, roasted_weight, percentage_loss, first_crack, cool_down, vac_to_250) values(${params.roast_number}, '${params.user_email}', '${params.coffee_origin}', '${params.date}', '${params.time}', ${params.green_weight}, ${params.roasted_weight}, ${params.percentage_loss}, ${params.first_crack}, ${params.cool_down}, ${params.vac_to_250})`,
    update: (table, whereStr, updateValues) => {
        const setStr = Object.keys(updateValues)
            .map((k) => `${k} = '${updateValues[k]}'`)
            .join(", ");
        return `update ${table} set ${setStr} ${whereStr}`;
    },
};
exports.sql = sqlStatements;
