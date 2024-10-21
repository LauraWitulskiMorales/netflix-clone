const cors = require('cors');
const express = require('express');
const moviesData = require('./data.json');
const favorites = require('./favorites');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// app.get('/movies', (request, response) => {
//   response.send(moviesData);
// });

app.get('/movies', (req, res) => {
  const search = req.query.search; // Get search query
  let filteredMovies = {}; // Object to store filtered results

  // If no search query exists, return all movies
  if (!search) {
    return res.json(moviesData);
  }

  // Loop through each category in moviesData
  Object.keys(moviesData).forEach((category) => {
    const movies = moviesData[category];
    

    // Filter movies based on the title
    const filteredCategoryMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
    
      filteredMovies[category] = filteredCategoryMovies;
    
  });

  // Return the filtered movies as a JSON response
  res.json(filteredMovies);
});





app.get('/movies/favorites', (req, res) => {
  res.json(favorites);
});

app.get('/movies/favorites/:id', (req, res) => {
  const { id } = req.params;

  const favorite = favorites.find(favorite => id === favorite.id);

  if (!favorite) {
    return res.status(404).json({ message: 'Movie not found in favorites' });
  }

  res.json(favorite);
});

app.post('/movies/favorites', (req, res) => {
  const { id, title, image } = req.body;

  console.log(req.body);

  if (!id || !title || !image) {
    return res.status(400).json({ message: 'Movie details incomplete', movie: { id, title, image } });
  }

  // check if already a favorite
  const movieExists = favorites.some(movie => movie.id === id);

  if (movieExists) {
    return res.status(409).json({ message: 'Movie is already in favorites' });
  }

  // Save the movie to favorites
  favorites.unshift({ id, title, image });

  return res.status(201).json(favorites);
});

app.delete('/movies/favorites/:id', (req, res) => {
  const { id } = req.params;

  // Find the index of the movie to delete
  const movieIndex = favorites.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found in favorites' });
  }

  // Remove the movie from the favorites array
  favorites.splice(movieIndex, 1);

  return res.status(200).json(favorites);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
