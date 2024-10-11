document.getElementById('search-button').addEventListener('click', () => {
  const searchInput = document.getElementById('searchInput');

  if (searchInput.classList.contains('hidden')) {
    searchInput.classList.remove('hidden');
    searchInput.classList.add('visible');
    searchInput.focus();
  }
  else {
    searchInput.classList.remove('visible');
    searchInput.classList.add('hidden');
  }
});

const searchInput = document.getElementById('searchInput');

// Event listener for search input
searchInput.addEventListener('input', (event) => {
  const query = event.target.value;

  const filteredMovies = filterMovies(query);

  renderMovies(filteredMovies);
});

/*
document.getElementById('search-button').addEventListener('click', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput.classList.contains('hidden')) {
        searchInput.classList.remove('hidden');
        searchInput.classList.add('visible');
        searchInput.focus();
    } else {
        searchInput.classList.remove('visible');
        searchInput.classList.add('hidden');
    }
});

document.getElementById('search-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
    const query = this.value.toLowerCase();
    const moviesFiltered = movies.filter(movie => movie.title.toLowerCase().includes(query))
    renderMovies(moviesFiltered);
    }
});

// Ensure 'movie.js' is loaded before using movie data from it.
// Get the search input field and add an event listener for typing
document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value.toLowerCase();  // Get the input value and convert to lowercase

    // Flatten all movie categories into a single array
    const allMovies = [
        ...moviesData.popularMovies,
        ...moviesData.recommendedMovies,
        ...moviesData.trendingMovies,
        ...moviesData.emotionalMovies,
        ...moviesData.continueWatching,
        ...moviesData.myList,
        ...moviesData.newMovies
    ];

    // Filter movies based on search query
    const moviesFiltered = allMovies.filter(movie => movie.title.toLowerCase().includes(query));

    // Call a function to render filtered movies
    renderMovies(moviesFiltered);
});

// Function to render filtered movies
function renderMovies(movies) {
    const searchResultsContainer = document.getElementById('search-results'); // Assuming you have a container for search results
    searchResultsContainer.innerHTML = '';  // Clear previous results

    // Loop through filtered movies and display them
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-item';
        movieElement.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <p>${movie.title}</p>
        `;
        searchResultsContainer.appendChild(movieElement);
    });

    // Handle case when no movies match the search
    if (movies.length === 0) {
        searchResultsContainer.innerHTML = '<p>No movies found</p>';
    }
}

// Function to render filtered movies
function renderMovies(movies) {
    for (const category in movies) {
      let rowId = categoryToId[category];

      const row = document.getElementById(rowId);

      if (row) {
          moviesData[category].forEach (movie => {
              const movieElement = document.createElement('div');
              movieElement.className = 'movie-row';
              movieElement.innerHTML = `
              <img src="${movie.image}" alt="${movie.title}">
              `;
              row.appendChild(movieElement);
          })
      } else {
          console.error(`Row with ID '${rowId}' not found`);
      }
  }
  }

  for (const category in moviesData) {
    let rowId = categoryToId[category];

    const row = document.getElementById(rowId);

    if (row) {
        moviesData[category].forEach (movie => {
            const movieElement = document.createElement('div');
            movieElement.className = 'movie-row';
            movieElement.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            `;
            row.appendChild(movieElement);
        })
    } else {
        console.error(`Row with ID '${rowId}' not found`);
    }
}
    */
