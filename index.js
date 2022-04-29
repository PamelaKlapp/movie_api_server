const express = require('express'),
      morgan = require('morgan')

const app = express();

app.use(morgan('common')); 

let top10movies = [
  {
    title: 'Spirited Away',
    director: 'Hayao Miyazaki'
  },
  {
    title: 'Django',
    director: 'Quentin Tarantino'
  },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    director: 'Michel Gondry'
  },
  {
    title: 'Amélie',
    director: 'Jean-Pierre Jeunet'
  },
  {
    title: 'El secreto de sus ojos',
    director: 'Juan José Campanella'
  },
  {
    title: 'Catch me if you can',
    director: 'Steven Spielberg'
  },
  {
    title: 'Ratatouille',
    director: 'Brad Bird & Jan Pinkava'
  },{
    title: 'Legally Blond',
    director: 'Robert Luketic'
  },
  {
    title: 'Miss Congeniality',
    director: 'Donald Petrie'
  },
  {
    title: 'Good Bye Lenin!',
    director: 'Wolfgang Becker'
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('These are my 10 TOP movies! Check them out!');
});

app.get('/movies', (req, res) => {
    res.json(top10movies);
});


//EXPRESS Static
app.use(express.static('public'));


//Error 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});