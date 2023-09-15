const db = require("./dbconfig");
const movieDB = require("./movie");

var genreDB = {};

//GET - Retrieve ALL Genre
genreDB.getAllGenre = (callback) => {
  var conn = db.getConnection();

  var sqlStmt = "SELECT * FROM genres";

  conn.query(sqlStmt, [], (err, result) => {
    conn.end();

    if (err) {
      return callback(err, null);
    } else {
      return callback(null, result);
    }
  });
};

//INSERT new Genre
genreDB.addGenre = (name_genre, description_genre, callback) => {
    
  var conn = db.getConnection();

  var sqlStmt =
    "INSERT INTO `movies`.`genres` (`name_genre`, `description_genre`) VALUES (?, ?)";

  conn.query(sqlStmt,[name_genre,description_genre],(err, result) => {
      conn.end();

      if (err) {
        return callback(err, null);
      } else {
        return callback(null, result);
      }
    }
  );
};

// DELETE Genre
genreDB.deleteGenre = function (genre_id, callback) {
  var conn = db.getConnection();

  var sqlStmt = "DELETE FROM `movies`.`genres` WHERE genre_id = ?";

  conn.query(sqlStmt, [genre_id], (err, result) => {
    if (err) {
      return callback(err, null);
    } else {
      return callback(null, result);
    }
  });
}

module.exports = genreDB;