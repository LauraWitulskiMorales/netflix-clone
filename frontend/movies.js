let moviesData = {};
let favorites = [];

const backendURL = 'http://localhost:3000';

//
// API FUNCTIONS
//
async function getMovies() {
  const response = await fetch('http://localhost:3000/movies');
  const moviesData = await response.json();

  return moviesData;
}

async function searchMovies(query) {
  const response = await fetch(`http://localhost:3000/movies?search=${encodeURIComponent(query)}`);
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

  localStorage.setItem('favorites', JSON.stringify(favorites));

  return favorites;
}

async function removeFavorite(movieId) {
  console.log("Attempting to remove movie with ID:", movieId);
  const response = await fetch(`${backendURL}/movies/favorites/${movieId}`, {
    method: 'DELETE',
  });

  const favorites = await response.json();

  localStorage.setItem('favorites', JSON.stringify(favorites));

  return favorites;
}

//
// EVENT LISTENERS
//
// FAVORITES BUTTONS

function handleFaves(addButt, removeButt, movie, movieEl, category, movies) {
  addButt.addEventListener('click', async () => {
    await addFavorite(movie); // Logic to add movie to favorites
    alert(`"${movie.title}" has been added to your List!`);
    
    // Refresh the movie data and re-render
    const updatedFavorites = await getFavorites(); // Fetch updated favorites
    await startApp(); // Call startApp to re-render with updated data
  });

  removeButt.addEventListener('click', async () => {
    await removeFavorite(movie.id); // Logic to remove movie from favorites
    alert(`"${movie.title}" has been removed from your List!`);
    
    // Refresh the movie data and re-render
    const updatedFavorites = await getFavorites(); // Fetch updated favorites
    await startApp(); // Call startApp to re-render with updated data
  });
}

//
// SEARCH QUERY
//

document.getElementById('searchInput').addEventListener('input', async (event) => {
  const query = event.target.value;
  const filteredMovies = await searchMovies(query);

  // Render the filtered movies
  renderMovies({
    ...filteredMovies,
    myList: favorites,
  });
});

//
// RENDERING 
//

function renderMovies(movies) {
  console.log("Rendering movies:", movies); // Log the movies to be rendered
  console.log("Current favorites:", favorites); // Log current favorites list

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
      

      movieEl.classList.toggle('favorite', movie.isFavorite);
      
      const imgEl = movieTemplate.querySelector('img');
      imgEl.alt = movie.title;
      imgEl.src = movie.image;

      const addButt = movieTemplate.querySelector('.addButton');
      const removeButt = movieTemplate.querySelector('.removeButton');

      handleFaves(addButt, removeButt, movie, movieEl, category, movies);

      movieList.appendChild(movieTemplate);
    });
  }
}

async function startApp() {
  moviesData = await getMovies();
  favorites = await getFavorites();

  console.log("Initial favorites:", favorites); // Log initial favorites
  // render the initial page
  renderMovies({
    ...moviesData,
    myList: favorites,
  });
}

startApp();
