const res = require("express/lib/response");
const { add } = require("lodash");

const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

app.use(bodyParser.json());

app.use(morgan("common"));

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
    genre: "Animation",
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
    genre: "Thriller",
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
  res.status(200).json(movies);
});


//Request to GET a single movie

app.get("/movies/:movieTitle", (req, res) => {
  const { title } = req.params;
  const movieTitle = movies.find( movie => movie.title === title );
  
  if (movieTitle) {
    res.status(200).json(movieTitle);
  } else {
    res.status(404).send("Not found the movie");
  }
});


//Request to GET a single genre

app.get("/movies/genre/:genreType", (req, res) => {
  const { genre } = req.params;
  const genreType = movies.find( movie => movie.genre === genre ).genre;
  
  if (genreType) {
    res.status(200).json(genreType);
  } else {
    res.status(404).send("There is no movie with this genre");
  }
});


//Request to GET the director's name 

app.get("/movies/director/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.director.name === directorName ).director;
  
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send("There is no director with that name");
  }
});


// Create a new user

app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  }else {
    res.status(400).send("It is required a name")
  }
})


//Update username

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user){
    user.name = updatedUser.name;
    res.status(200).json(user);
  }else {
    res.status(404).send("Update was not possible")
  }
})


//Add movie to favorites

app.post("/users/:id/favorites/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user){
    user.favoriteMovies.push(movieTitle)
    res.status(200).send(`${movieTitle} has been added to user ${id} favorite List`);
  }else {
    res.status(404).send("Movie was not possible to add to favorite List")
  }
})


//DELETE movie from favorites

app.delete("/users/:id/favorites/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user){
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle );
    res.status(200).send(`${movieTitle} has been deleted from user ${id} favorite List`);
  }else {
    res.status(404).send("Movie was not possible to remove from favorite List")
  }
})


//DELETE user

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user){
    users = users.filter( user => user.id != id )
    res.status(200).send(`${user.name} has been remove from platform`);
  }else {
    res.status(404).send("User is stuck with us!")
  }
})


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
