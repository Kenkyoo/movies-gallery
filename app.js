const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDEzZGYyYTE2MjJhZDM1OTQyYzAwOTJmMGE0YmNjOCIsIm5iZiI6MTcyMTEwNDExNC45MTE5MTEsInN1YiI6IjY2MDVlYjI1NDE3YWFmMDE3ZDYwYjgxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1-ycZocPgNb230KRlyg5wg_SBaNqb6XyAEfBmC-o0zk'
    }
};

const urlImage = 'https://image.tmdb.org/t/p/original/';
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const listGroup = document.getElementById('listGroup');
const recommendationsDiv = document.getElementById('recommendations');
const selectedMovieDiv = document.getElementById('selectedMovie');  // Asegúrate de tener este div en tu HTML

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput.value;
    searchMovies(query);
});

function searchMovies(query) {
    fetch(`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${query}`, options)
        .then(response => response.json())
        .then(response => {
            displayResults(response.results);
        })
        .catch(err => console.error(err));
}

function displayResults(movies) {
    listGroup.innerHTML = '';

    movies.forEach(movie => {
        let movieItem = document.createElement('a');
        movieItem.href = "#";
        movieItem.className = "list-group-item list-group-item-action d-flex rounded-3 gap-3 py-3";
        movieItem.setAttribute('aria-current', 'true');

        movieItem.innerHTML = `
            <img src="${urlImage}${movie.poster_path}" alt="${movie.title}" width="64" height="64" class="flex-shrink-0">
            <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                    <h6 class="mb-0">${movie.title}</h6>
                    <p class="mb-0 opacity-75">${movie.release_date}</p>
                </div>
                <small class="opacity-50 text-nowrap">${movie.vote_average}</small>
            </div>
        `;

        movieItem.addEventListener('click', (e) => {
            e.preventDefault();
            getRecommendations(movie.id);
            showSelectedMovie(movie);
            listGroup.innerHTML = '';
        });

        listGroup.appendChild(movieItem);
    });
}

function showSelectedMovie(movie) {
    selectedMovieDiv.innerHTML = `
        <div class="col-md-6">
            <div class="card shadow-sm mb-4">
                <img src="${urlImage}${movie.backdrop_path}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.overview}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm border-primary">Vote: ${movie.vote_average}</button>
                            <button type="button" class="btn btn-sm border-primary">Lang: ${movie.original_language}</button>
                        </div>
                        <small class="text-primary">${movie.release_date}</small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getRecommendations(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
        .then(response => response.json())
        .then(response => {
            displayImages(response.backdrops)
        })
        .catch(error => console.error('Error:', error));
}

function displayImages(images) {
  let imgs = "";
  let idx = 0;
  images.forEach(img => {
    idx++;
    imgs += `
    <div class="col-md-4 content">
      <a href="${urlImage}${img.file_path}" data-lightbox="img-${idx}" data-title="My caption">
        <img data-src="${urlImage}${img.file_path}" class="img-thumbnail lazyload">
      </a>  
    </div>
    `;
  });
  recommendationsDiv.innerHTML = imgs;


  $(".content").slice(0, 20).show(); // Mostrar las primeras 4 imágenes
  $("#loadMore").on("click", function(e){
    e.preventDefault();
    $(".content:hidden").slice(0, 10).slideDown(); // Mostrar las siguientes 4 imágenes ocultas
    if($(".content:hidden").length == 0) {
      $("#loadMore").text("No Content").addClass("noContent");
    }
    lazySizes.update(); // Actualizar lazysizes después de mostrar nuevas imágenes
  });
};

/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    'use strict'
  
    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme()
      if (storedTheme) {
        return storedTheme
      }
  
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  
    const setTheme = theme => {
      if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
      }
    }
  
    setTheme(getPreferredTheme())
  
    const showActiveTheme = (theme, focus = false) => {
      const themeSwitcher = document.querySelector('#bd-theme')
  
      if (!themeSwitcher) {
        return
      }
  
      const themeSwitcherText = document.querySelector('#bd-theme-text')
      const activeThemeIcon = document.querySelector('.theme-icon-active use')
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
      const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')
  
      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active')
        element.setAttribute('aria-pressed', 'false')
      })
  
      btnToActive.classList.add('active')
      btnToActive.setAttribute('aria-pressed', 'true')
      activeThemeIcon.setAttribute('href', svgOfActiveBtn)
      const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
      themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
  
      if (focus) {
        themeSwitcher.focus()
      }
    }
  
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = getStoredTheme()
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
      }
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(getPreferredTheme())
  
      document.querySelectorAll('[data-bs-theme-value]')
        .forEach(toggle => {
          toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute('data-bs-theme-value')
            setStoredTheme(theme)
            setTheme(theme)
            showActiveTheme(theme, true)
          })
        })
    })
  })()
  
  