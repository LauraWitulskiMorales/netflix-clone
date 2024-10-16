const data = require('./data.json');

function filteredMovies(query) {
  // if no query was passed, use the default dataset
  if (!query) {
    return data;
  }

  const filteredMovies = {};

  // Loop through each category
  Object.keys(data).forEach((category) => {
    const movies = data[category];
    const filteredCategoryMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()),
    );

    filteredMovies[category] = filteredCategoryMovies;
  });

  return filteredMovies;
}

module.exports = filteredMovies;
