const res = require("express/lib/response");
const { add, rest } = require("lodash");

const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  
  Movies = Models.Movie,
  Users = Models.User;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("common"));


mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

let users = [
  {
    id: 1,
    name: "Martin Schmidt",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Kim Kardashian",
    favoriteMovies: ["Django Unchained"],
  },
];

let movies = [
  {
    title: "Spirited Away",
    description:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    genreType: "Animation",
    director: {
      name: "Hayao Miyazaki",
      birth: "1965",
      death: false,
    },
  },
  {
    title: "Django Unchained",
    description:
      "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi.",
    genreType: "Thriller",
    director: {
      name: "Quentin Tarantino",
      birth: "1963",
      death: false,
    },
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    director: "Michel Gondry",
  },
  {
    title: "Amélie",
    director: "Jean-Pierre Jeunet",
  },
  {
    title: "El secreto de sus ojos",
    director: "Juan José Campanella",
  },
  {
    title: "Catch me if you can",
    director: "Steven Spielberg",
  },
  {
    title: "Ratatouille",
    director: "Brad Bird & Jan Pinkava",
  },
  {
    title: "Legally Blond",
    director: "Robert Luketic",
  },
  {
    title: "Miss Congeniality",
    director: "Donald Petrie",
  },
  {
    title: "Good Bye Lenin!",
    director: "Wolfgang Becker",
  },
];

// Request to GET all movies

app.get("/movies", (req, res) => {
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

app.get("/movies/:Title", (req, res) => {
  //const { movieTitle } = req.params;
  //const movie = movies.find( movie => movie.title === movieTitle );
  // if (movie) {
  //   res.status(200).json(movie);
  // } else {
  //   res.status(404).send("Not found the movie");
  // }
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

app.get("/movies/genre/:genreName", (req, res) => {
//   const { genreName } = req.params;
//   const genre = movies.find( movie => movie.genre === genreName ).genre;
//   if (genre) {
//     res.status(200).json(genre);
//   } else {
//     res.status(404).send("There is no movie with this genre");
//   }
// });
Movies.findOne({ "Genre.Name": req.params.genreName })
.then((movie) => {
  res.json(movie.Genre);
})
.catch((err) =>{
  console.error(err);
  res.status(404).send("There is no genre with that name")
})
});


//Request to GET the director's name 

app.get("/movies/director/:directorName", (req, res) => {
//   const { directorName } = req.params;
//   const director = movies.find( movie => movie.director.name === directorName ).director;
  
//   if (director) {
//     res.status(200).json(director);
//   } else {
//     res.status(404).send("There is no director with that name");
//   }
// });
Movies.findOne({ "Director.Name": req.params.directorName })
.then((movie) => {
  res.json(movie.Director);
})
.catch((err) =>{
  console.error(err);
  res.status(404).send("There is no genre with that name")
})
});


// Create a new user

app.post("/users", (req, res) => {
//   const newUser = req.body;

//   if (newUser.name) {
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser)
//   }else {
//     res.status(400).send("It is required a name")
//   }
// })
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

app.put("/users/:username", (req, res) => {
  // const { id } = req.params;
  // const updatedUser = req.body;

  // let user = users.find( user => user.id == id );

  // if (user){
  //   user.name = updatedUser.name;
  //   res.status(200).json(user);
  // }else {
  //   res.status(404).send("Update was not possible")
  // }
  Users.findOneAndUpdate(
    {Username: req.params.username},
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

app.post("/users/:username/favorites/:Title", (req, res) => {
  // const { id, movieTitle } = req.params;

  // let user = users.find( user => user.id == id );

  // if (user){
  //   user.favoriteMovies.push(movieTitle)
  //   res.status(200).send(`${movieTitle} has been added to user ${id} favorite List`);
  // }else {
  //   res.status(404).send("Movie was not possible to add to favorite List")
  // }
  Users.findOneAndUpdate({Username: req.params.username},
    {$push:
      { favoriteMovies: req.params.Title}
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

app.delete("/users/:username/favorites/:MovieID", (req, res) => {
  // const { id, movieTitle } = req.params;

  // let user = users.find( user => user.id == id );

  // if (user){
  //   user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle );
  //   res.status(200).send(`${movieTitle} has been deleted from user ${id} favorite List`);
  // }else {
  //   res.status(404).send("Movie was not possible to remove from favorite List")
  // }
  Users.findOneAndUpdate({Username: req.params.username},
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

app.delete("/users/:username", (req, res) => {
  // const { id } = req.params;

  // let user = users.find( user => user.id == id );

  // if (user){
  //   users = users.filter( user => user.id != id )
  //   res.status(200).send(`${user.name} has been remove from platform`);
  // }else {
  //   res.status(404).send("User is stuck with us!")
  // }
  Users.findOneAndRemove({Username: req.params.username})
  .then((user) =>{
    if(!user){
      res.status(400).send(req.params.username + " was not found.");
    }else {
      res.status(200).send(req.params.username + " was deleted");
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
