const express = require("express");
const path = require("path");
const jwt = require('jsonwebtoken');
const { jwtKey } = require("../model/config");
const movieDB = require("../model/movie");
const genreDB = require("../model/genre");
const userDB = require("../model/user");
const e = require('express');


var app = express();

app.use(express.json());
app.use(express.static(path.resolve("./public")));

// middleware function
function verifyToken(req, res, next) {
  var token = req.header("Authorization");

  if (!token || !token.includes("Bearer ")) {
    res.status(403).send({"message":"Authorization token not found"})
  } else {
    token = token.split("Bearer ")[1]; //must have a space between quotes for 'Bearer '

    // decrypt with jwtkey
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log(req.login);
        req.login = decoded;
        next();
      }
    })
  }
}

app.get('/', function (req, res) {
  res.send('Wee 1st Web API');
});

// Verify admin credentials (jwt)
app.post("/user/login", (req, res) => {
  userDB.login(req.body.email, req.body.password, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // if (result.length > 0 && result[0].role == 'admin') {
        if (result.length > 0) {
        console.log(result[0]);
        var tokenPayload = { email:result[0].email, role: result[0].role };
        var token = jwt.sign(tokenPayload, jwtKey, { expiresIn: "1h" })
        res.status(200).send({ "token": token });
      } else {
        res.status(403).send({ "message": "Wrong username/password " });
      }
    }
  })
})

// PUT : update movies (Admin only)
app.put("/update_movie/:movie_id", verifyToken, (req, res) => {
  if (req.login.role == "admin") {
    var { name_movie, description_movie, release_date, image_URL, genre_id, date_inserted } = req.body;
 
  
    movieDB.update(name_movie, description_movie, release_date, image_URL, genre_id, date_inserted, req.params.movie_id, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (result.affectedRows > 0) {
          res.status(200).send({ "message": "Movie ID <" + req.params.movie_id + "> updated" })
        } else {
          res.status(200).send({ "message": "Movie ID <" + req.params.movie_id + "> not found" })
        }
      }
    });
  } else {
    res.status(403).send({"message":"Unauthorised access."})
  }
})

// // GET by movie name which begin with 'A' and ascending order by release_date
// app.get("/movieNameBySubString=A", (req, res) => {
  
//   movieDB.getMovieBySubString((err, result) => {
//     //console.log(err, result)
  
//   if (err) {
//       res.status(500).send(err);
//     } else
//       { res.status(200).send(result); }
//     })
//   })

//GET Active movies
app.get("/movie=ACTIVE", (req, res) => {
    
  movieDB.getActiveMovie((err, result) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  })
  });


// GET ALL movies
app.get("/movies",(req, res) => {
  
  movieDB.getAllMovie((err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      {
        res.status(200).send(result);
      }
    }
  });
});

//INSERT new movie - for admin only
app.post("/movie", verifyToken, (req, res) => {
  if (req.login.role == "admin") {
    var { name_movie, description_movie, release_date, image_URL, genre_id, date_inserted } = req.body;

    movieDB.addMovie(name_movie, description_movie, release_date, image_URL, genre_id, date_inserted, (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
        res.status(200).send({ message: "Movie " + result.insertId + " has been added." });
      }
    })
  } else {
    res.status(403).send({"message":"Unauthorised access."})
  }
  });


//GET all genres
app.get("/genres", (req, res) => {
  genreDB.getAllGenre((err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      {
      res.status(200).send(result);
      }
    }
  })
})

//INSERT new genres - for admin only
app.post("/genre", verifyToken, (req, res) => {
  if (req.login.role == "admin") {
    var { name_genre, description_genre } = req.body;

    genreDB.addGenre(name_genre, description_genre, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({ message: "Genre " + result.insertId + " has been added." });
      }
    }
    );
  }
  else {
    res.status(403).send({"message":"Unauthorised access."})
  }
});


// DELETE genre - for admin only
app.delete("/delete_genre/:genre_id", verifyToken,(req,res)=>{
  
  if (req.login.role == "admin") {
    var genre_id = req.params.genre_id;

    genreDB.deleteGenre(req.params.genre_id, (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        if (result.affectedRows > 0) {
          res.status(200).send({ "message": "Movies deleted.", "genre_id": genre_id });
        } else {
          res.status(400).send({ "message": "Genre not found.", "genre_id": genre_id });
        }
      }
    }
    )
  }
})


  



  
    
  
      

// // middleware to customised bad request 404 message
// app.use((req, res, next) => {
//   res.status(404).send({ message:'Error Occured! ' });
// });



module.exports = app;
