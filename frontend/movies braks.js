/**
 * @type {Record<string, Movie[]>}
 */
let moviesData = {};

const favoritesStorageKey = 'movie-favorties';

/**
 * @typedef {object} Movie
 * @property {string} id - The id of the movie
 * @property {string} title - The title of the movie
 * @property {string} image - The image src URL for the movie
 */

/**
 * This function filters movies by a given query.
 * It uses the query to check if any of the existing movies in the dataset match the query in some way.
 *
 * @param {string} query - The query string to match against
 * @returns {Record<string, Movie[]>} - The filtered movies by category (as key -> category, value -> movies)
 */
function filterMovies(query) {
  // if no query was passed, use the default dataset
  if (!query) {
    return moviesData;
  }

  const filteredMovies = {};

  // Loop through each category
  Object.keys(moviesData).forEach((category) => {
    const movies = moviesData[category];
    const filteredCategoryMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()),
    );
    filteredMovies[category] = filteredCategoryMovies;
  });

  return filteredMovies;
}

/**
 *
 * @returns {Movie[]} - an array of movie ids that are saved as favorites
 */
function getFavorites() {
  return JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];
}

/**
 *
 * @param {Movie[]} movies - an array of movie ids to save as favorites
 */
function setFavorites(movies) {
  localStorage.setItem(favoritesStorageKey, JSON.stringify(movies));
}

/**
 * Renders a list of movies.
 *
 * @param {Record<string, Movie[]>} movies - the list of movies to render.
 * @returns {void}
 */
function renderMovies(movies) {
  // item template for cloning purposes
  const itemTemplate = document.getElementById('movieTemplateItem');

  // retrieve data from local storage
  const favorites = getFavorites();

  for (const category in movies) {
    const row = document.getElementById(category);

    if (!row) {
      console.error(`Row with ID '${category}' not found`);
      return;
    }

    const movieList = row.querySelector('ul');

    // empty the list so we can append new items or remove filtered ones
    movieList.innerHTML = '';

    if (!movies[category].length) {
      movieList.innerHTML = `<div style="font-size: 18px; font-weight: 700;">No results found. 🥺</div>`;
    }

    movies[category].forEach((movie) => {
      // clone the list item from the template
      const movieTemplate = itemTemplate.content.cloneNode(true);
      const movieEl = movieTemplate.querySelector('li');

      const isFavorite = favorites.find(favorite => favorite.id === movie.id);

      if (isFavorite) {
        movieEl.classList.add('favorite');
      }
      else {
        movieEl.classList.remove('favorite');
      }

      const imgEl = movieTemplate.querySelector('img');

      // add necessary info to img tag
      imgEl.alt = movie.title;
      imgEl.src = movie.image;

      const addButt = movieTemplate.querySelector('.addButton');
      const removeButt = movieTemplate.querySelector('.removeButton');

      addButt.addEventListener('click', () => {
        favorites.unshift(movie);
        setFavorites(favorites);

        alert(`${movie.title} has been added to your list`);

        renderMovies({
          [category]: movies[category],
          myList: getFavorites(),
        });
      });

      removeButt.addEventListener('click', () => {
        // if the favorite.id does not match the movie.id, keep the favorite in the list
        const filteredFavorites = favorites.filter(favorite => favorite.id !== movie.id);
        
        setFavorites(filteredFavorites);

        alert(`${movie.title} has been removed from your list`);

        renderMovies({
          [category]: movies[category],
          myList: getFavorites(),
        });
      });

      movieList.appendChild(movieTemplate);
    });
  }
}

async function startApp() {
  const response = await fetch('http://localhost:3000/movies');
  moviesData = await response.json();

  const savedFavorites = getFavorites();

  // render the initial page
  renderMovies({
    ...moviesData,
    myList: savedFavorites,
  });
}

startApp();
