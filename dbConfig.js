const mysql = require("mysql");

var dbConnection = {};

dbConnection.getConnection = () => {
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "movies",
  });

  return conn;
};
module.exports = dbConnection;
