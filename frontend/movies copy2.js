let moviesData = {};
let favorites = [];

const backendURL = 'http://localhost:3000';

/// / script.js

// Fetch movies data from the Express server
fetch('http://localhost:3000/movies')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON data
  })
  .then((movies) => {
  // Call a function to render the movies on the webpage
    renderItems(movies);
  })
  .catch((error) => {
    console.error('There was a problem with the fetch operation:', error);
  });

// Function to render movies
function renderItems(movies) {
  const moviesContainer = document.getElementById('movies-container'); // Make sure this matches your HTML

  // Clear previous content
  moviesContainer.innerHTML = '';

  // Iterate through the movies and create elements
  movies.forEach((movie) => {
    const movieElement = document.createElement('div');
    movieElement.className = 'movie';
    movieElement.innerHTML = `<h2>${movie.title}</h2><p>${movie.year}</p>`;
    moviesContainer.appendChild(movieElement);
  });
}

// API FUNCTIONS
//
async function getMovies() {
  const response = await fetch('http://localhost:3000/movies');
  moviesData = await response.json();

  return moviesData;
}

async function searchMovies(query) {
  const response = await fetch(`http://localhost:3000/filter?q=${encodeURIComponent(query)}`);
  const filteredMovies = await response.json();

  return filteredMovies;
}

async function getFavorites() {
  const response = await fetch(`${backendURL}/movies/favorites`);
  const favorites = await response.json();

  return favorites;
}

async function addFavorite(movie) {
  const response = await fetch(`${backendURL}/movies/favorites`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movie),
  });
  const favorites = await response.json();

  return favorites;
}

async function removeFavorite(movieId) {
  const response = await fetch(`${backendURL}/movies/favorites/${movieId}`, {
    method: 'DELETE',
  });

  const favorites = await response.json();

  return favorites;
}

//
// APP FUNCTIONS
//
// function filterMovies(query) {
//   // if no query was passed, use the default dataset
//   if (!query) {
//     return moviesData;
//   }

//   const filteredMovies = {};

//   // Loop through each category
//   Object.keys(moviesData).forEach((category) => {
//     const movies = moviesData[category];
//     const filteredCategoryMovies = movies.filter(movie =>
//       movie.title.toLowerCase().includes(query.toLowerCase()),
//     );
//     filteredMovies[category] = filteredCategoryMovies;
//   });

//   return filteredMovies;
// }

function renderMovies(movies) {
  console.log(movies);
  // item template for cloning purposes
  const itemTemplate = document.getElementById('movieTemplateItem');

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

    movies[category].forEach(async (movie) => {
      // clone the list item from the template
      const movieTemplate = itemTemplate.content.cloneNode(true);
      const movieEl = movieTemplate.querySelector('li');

      const isFavorite = !!favorites.find(fav => fav.id === movie.id);

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

      addButt.addEventListener('click', async () => {
        favorites = await addFavorite(movie);

        // update the category and favorite list
        renderMovies({
          [category]: movies[category],
          myList: favorites,
        });
      });

      removeButt.addEventListener('click', async () => {
        favorites = await removeFavorite(movie.id);

        // update the category and favorite list
        renderMovies({
          [category]: movies[category],
          myList: favorites,
        });
      });

      movieList.appendChild(movieTemplate);
    });
  }
}

async function startApp() {
  moviesData = await getMovies();
  favorites = await getFavorites();

  // render the initial page
  renderMovies({
    ...moviesData,
    myList: favorites,
  });
}

startApp();
