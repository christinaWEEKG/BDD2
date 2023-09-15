const db = require("./dbConfig");


var userDB = {};

userDB.login = (email, password, callback) => {
    var conn = db.getConnection();

    var sqlStmt = "SELECT role FROM users WHERE email =? AND password =?";

    conn.query(sqlStmt, [email, password], (err, result) => {
        conn.end();

        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

module.exports = userDB;