const db = require("./dbConfig");

var movieDB = {};

movieDB.update = (name_movie, description_movie, release_date, image_URL, genre_id, date_inserted, movie_id, callback) => {
  var conn = db.getConnection();

  var sqlStmt = "UPDATE `movies`.`movies` SET `name_movie` = ?, `description_movie` = ?, `release_date` = ?, `image_URL`=?, `genre_id` = ?, `date_inserted`=? WHERE (`movie_id` = ?);"
  conn.query(sqlStmt, [name_movie, description_movie, release_date, image_URL, genre_id, date_inserted, movie_id], (err, result) => {
    conn.end();

    if (err) {
      return callback(err, null);
    } else {
      return callback(null, result);
    }
  });
};


// // GET by movie name begin with 'A' and ascending order by release_date
// movieDB.getMovieBySubString = (callback) => {
//   var conn = db.getConnection();

//   var sqlStmt = "SELECT * FROM movies WHERE name_movie LIKE ? ORDER BY release_date ASC";

//   conn.query(sqlStmt, ['A%'], (err, result) => {
//     conn.end();

//     if (err) {
//       return callback(err, null);
//     } else {
//       return callback(null, result);
//     }
//   });
// };


//GET - retrieve all active screening movies
movieDB.getActiveMovie = (callback) => {
  var conn = db.getConnection();

  
  var sqlStmt = "SELECT * FROM movies WHERE release_date> DATE_SUB(curdate(),INTERVAL 2 MONTH);"
  conn.query(sqlStmt, [], (err, result) => {
    conn.end();
    //console.log(result)

    if (err) {
      return callback(err, null);
    } else {
      return callback(null, result);
    }
  });
};

//GET - Retrieve ALL movies
movieDB.getAllMovie = (callback) => {
  var conn = db.getConnection();

  var sqlStmt = "SELECT * FROM movies";

  conn.query(sqlStmt, [], (err, result) => {
    conn.end();
    //console.log(result)

    if (err) {
      return callback(err, null);
    } else {
      return callback(null, result);
    }
  });
};

//INSERT - Add new movie
movieDB.addMovie = (name_movie,description_movie,release_date,image_URL,genre_id,date_inserted,callback) => {
  var conn = db.getConnection();

  var sqlStmt =
    "INSERT INTO `movies`.`movies` (`name_movie`, `description_movie`, `release_date`, `image_URL`, `genre_id`, `date_inserted`) VALUES (?, ?, ?, ?, ?, ?)";

  conn.query(sqlStmt,[name_movie,description_movie,release_date,image_URL,genre_id,date_inserted],(err, result) => {
      conn.end();

      if (err) {
        return callback(err, null);
      } else {
        return callback(null, result);
      }
    }
  );
};

module.exports = movieDB;
