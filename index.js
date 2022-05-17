const res = require("express/lib/response");
const { add, rest } = require("lodash");

const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require('mongoose'),
  Models = require('./models.js');

  
  Movies = Models.Movie,
  Users = Models.User;
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  let auth = require('./auth')(app);
  const passport = require('passport');
  require('./passport');
  
  app.use(morgan("common"));

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Request to GET all movies

app.get("/movies", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//Request to GET a single movie

app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then((movies) => {
    res.json(movies);
  })
  .catch((err) =>{
    console.error(err);
    res.status(404).send("Movie not found.");
  })
});


//Request to GET a single genre

app.get("/movies/genre/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
Movies.findOne({ "Genre.Name": req.params.Name })
.then((movie) => {
  res.json(movie.Genre);
})
.catch((err) =>{
  console.error(err);
  res.status(404).send("There is no genre with that name")
})
});


//Request to GET the director's name 

app.get("/movies/director/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
Movies.findOne({ "Director.Name": req.params.Name })
.then((movie) => {
  res.json(movie.Director);
})
.catch((err) =>{
  console.error(err);
  res.status(404).send("There is no director with that name")
})
});


// Create a new user

app.post("/users", (req, res) => {
  Users.findOne({Username: req.body.Username})
  .then((user) =>{
    if(user){
      return res.status(400).send(req.body.Username + " already exists");
    }else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user)=>{
        res.status(201).json(user)
      })
      .catch((err)=> {
        console.error(err);
        res.status(500).send("Error " + err);
      })
    }
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send("Error " + err);
  });
});


//Update username
app.put("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    {Username: req.params.Username},
    {$set:{
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    },
  },
    {new: true},
    (err, updatedUser) =>{
      if(err){
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});




//Add movie to favorites

app.post("/users/:Username/favorites/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username},
    {$push:
      { favoriteMovies: req.params.MovieID}
    },
    {new:true},
    (err, updatedUser) =>{
      if (err){
        console.error(err),
        res.status(500).send("Error: " + err);
      } else{
        res.json(updatedUser);
      }
    }
  );
});


//DELETE movie from favorites

app.delete("/users/:Username/favorites/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username},
    {$pull:
      { favoriteMovies: req.params.MovieID}
    },
    {new:true},
    (err, updatedUser) =>{
      if (err){
        console.error(err),
        res.status(500).send("Error: " + err);
      } else{
        res.json(updatedUser);
      }
    }
  );
});


//DELETE user

app.delete("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({Username: req.params.Username})
  .then((user) =>{
    if(!user){
      res.status(400).send(req.params.Username + " was not found.");
    }else {
      res.status(200).send(req.params.Username + " was deleted");
    }
  })
  .catch((err) =>{
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


//EXPRESS Static
app.use(express.static("public"));

//Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
