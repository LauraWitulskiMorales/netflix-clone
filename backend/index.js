const cors = require('cors');
const express = require('express');
const moviesData = require('./data.json');
const favorites = require('./favorites');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Utility function to add `isFavorite` property
function attachFavoriteStatus(movies) {
  return movies.map(movie => ({
    ...movie,
    isFavorite: favorites.some(fav => fav.id === movie.id)
  }));
}

app.get('/movies', (req, res) => {
  const search = req.query.search; 
  let filteredMovies = {}; 

  if (!search) {
    // Add `isFavorite` to each movie in all categories if no search is applied
    for (const category in moviesData) {
      filteredMovies[category] = attachFavoriteStatus(moviesData[category]);
    }
    return res.json(filteredMovies);
  }

  Object.keys(moviesData).forEach((category) => {
    const movies = moviesData[category];
    const filteredCategoryMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
    filteredMovies[category] = attachFavoriteStatus(filteredCategoryMovies);
  });

  res.json(filteredMovies);
});

app.get('/movies/favorites', (req, res) => {
  res.json(favorites.map(movie => ({ ...movie, isFavorite: true })));
});

app.post('/movies/favorites', (req, res) => {
  const { id, title, image } = req.body;

  if (!id || !title || !image) {
    return res.status(400).json({ message: 'Movie details incomplete', movie: { id, title, image } });
  }

  const movieExists = favorites.some(movie => movie.id === id);

  if (movieExists) {
    return res.status(409).json({ message: 'Movie is already in favorites' });
  }

  favorites.unshift({ id, title, image });
  res.status(201).json(favorites.map(movie => ({ ...movie, isFavorite: true })));
});

app.delete('/movies/favorites/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = favorites.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found in favorites' });
  }

  favorites.splice(movieIndex, 1);

  return res.status(200).json(favorites);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
