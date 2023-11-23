const URL_API_BASE = "https://api.themoviedb.org/3";
const TREND = "/trending/movie/day?"
const GENRE = "/genre/movie/list?"
const CATEGORY = "/discover/movie?"
const PATH_IMAGE = "https://image.tmdb.org/t/p/w300"

const api = axios.create({
    baseURL: URL_API_BASE,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        api_key: API_KEY2,
        language: 'es-Mx',
    }
});

function hasLikedList() {
    return JSON.parse(localStorage.getItem('liked_movies')) || {};
}

function likeMovie(movie) {
    const likedMovies = hasLikedList();
    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
    if (location.hash == '') {
        homePage();
    }

}
/*
// USANDO FETCH NORMAL AQUI
async function getTrendingPreview(endPoint) {
    const responseFetch = await fetch(URL_API_BASE + endPoint + API_KEY);
    const data = await responseFetch.json();
    const movies = data.results;

    const listMovie = movies.map(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src',
            `${PATH_IMAGE}${movie.poster_path}`
        );
        movieContainer.appendChild(movieImg);

        return movieContainer
    });

    const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');
    trendingPreviewMoviesContainer.append(...listMovie);
}
*/

const movieimageId = (id) => {
    location.hash = '#movie=' + id;
}

function createMovies(movies, container, { clean = true } = {}) {
    if (clean) {
        container.innerHTML = "";
    }

    const listMovie = movies.map(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        // movieImg.setAttribute(
        //     'src', `${PATH_IMAGE}${movie.poster_path}`
        // );
        movieImg.dataset.id = movie.id;
        movieImg.dataset.src = `${PATH_IMAGE}${movie.poster_path}`;
        movieContainer.appendChild(movieImg);
        registerImage(movieImg);
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://static.thenounproject.com/png/6018987-200.png')
        })

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        hasLikedList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
        })

        movieContainer.appendChild(movieBtn);
        return movieContainer;
    });


    container.append(...listMovie);
}

const categoryData = (category) => {
    location.hash = `#category=${category.id}-${category.name}`;
}



function createCategories(categories, container) {
    container.innerHTML = "";

    const listCategory = categories.map(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => categoryData(category))
        const categoryTitleText = document.createTextNode(category.name);
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);

        return categoryContainer
    });

    container.append(...listCategory);
}

async function getTrendingPreview(endPoint) {
    const { data } = await api(endPoint);
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList);
    trendingMoviesPreviewList.addEventListener('click', (event) => {
        if (event.target.nodeName === 'IMG') {
            movieimageId(event.target.dataset.id);
        }
    });


    // trendingMoviesPreviewList.innerHTML = "";

    // const listMovie = movies.map(movie => {
    //     const movieContainer = document.createElement('div');
    //     movieContainer.classList.add('movie-container');
    //     const movieImg = document.createElement('img');
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);
    //     movieImg.setAttribute(
    //         'src',
    //         `${PATH_IMAGE}${movie.poster_path}`
    //     );
    //     movieContainer.appendChild(movieImg);

    //     return movieContainer
    // });

    // trendingMoviesPreviewList.append(...listMovie);

}

async function getMoviesByCategory(id) {
    const { data } = await api(CATEGORY, {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection);
    genericSection.addEventListener('click', (event) => {
        if (event.target.nodeName === 'IMG') {
            movieimageId(event.target.dataset.id);
        }
    });


    // genericSection.innerHTML = "";

    // const listMovie = movies.map(movie => {
    //     const movieContainer = document.createElement('div');
    //     movieContainer.classList.add('movie-container');
    //     const movieImg = document.createElement('img');
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);
    //     movieImg.setAttribute(
    //         'src',
    //         `${PATH_IMAGE}${movie.poster_path}`
    //     );
    //     movieContainer.appendChild(movieImg);

    //     return movieContainer
    // });

    // genericSection.append(...listMovie);

}

// async function getCategoriesPreview(endPoint) {
//     const responseFetch = await fetch(URL_API_BASE + endPoint + API_KEY);
//     const data = await responseFetch.json();
//     const categories = data.genres;

//     const listCategory = categories.map(category => {
//         const categoryContainer = document.createElement('div');
//         categoryContainer.classList.add('category-container');
//         const categoryTitle = document.createElement('h3');
//         categoryTitle.classList.add('category-title');
//         categoryTitle.setAttribute('id', 'id' + category.id);
//         const categoryTitleText = document.createTextNode(category.name);
//         categoryTitle.appendChild(categoryTitleText);
//         categoryContainer.appendChild(categoryTitle);

//         return categoryContainer
//     });

//     const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');
//     previewCategoriesContainer.append(...listCategory);
// }

async function getCategoriesPreview(endPoint) {
    const { data } = await api(endPoint);
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);
    // categoriesPreviewList.innerHTML = "";

    // const listCategory = categories.map(category => {
    //     const categoryContainer = document.createElement('div');
    //     categoryContainer.classList.add('category-container');
    //     const categoryTitle = document.createElement('h3');
    //     categoryTitle.classList.add('category-title');
    //     categoryTitle.setAttribute('id', 'id' + category.id);
    //     categoryTitle.addEventListener('click', () => {
    //         location.hash = `#category=${category.id}-${category.name}`;
    //     })
    //     const categoryTitleText = document.createTextNode(category.name);
    //     categoryTitle.appendChild(categoryTitleText);
    //     categoryContainer.appendChild(categoryTitle);

    //     return categoryContainer
    // });

    // categoriesPreviewList.append(...listCategory);
}

async function getMoviesBySearch(query) {
    const { data } = await api('/search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection);
    genericSection.addEventListener('click', (event) => {
        if (event.target.nodeName === 'IMG') {
            movieimageId(event.target.dataset.id);
        }
    });

}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { clean: true });
    genericSection.addEventListener('click', (event) => {
        if (event.target.nodeName === 'IMG') {
            movieimageId(event.target.dataset.id);
        }
    });

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar más';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);

}

async function getPaginatedTrendingMovies() {

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;
        createMovies(movies, genericSection, { clean: false });

    }

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar más';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
}

function getPaginatedMoviesBySearch(query) {

    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;
            createMovies(movies, genericSection, { clean: false });

        }
    }

}

function getPaginatedMoviesByCategory(id) {

    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api(CATEGORY, {
                params: {
                    with_genres: id,
                    page,
                }
            });
            const movies = data.results;


            createMovies(movies, genericSection, { clean: false });

        }
    }

}

async function getMovieById(movieId) {
    const { data: movie } = await api('movie/' + movieId);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0,0,0,0.35) 19.27%,
        rgba(0,0,0,0) 29.17%
    ),url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesId(movieId);
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
    relatedMoviesContainer.addEventListener('click', (event) => {
        if (event.target.nodeName === 'IMG') {
            movieimageId(event.target.dataset.id);
        }
    });
}

function getLikedMovies() {
    const likedMovies = hasLikedList();

    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likedMovieListArticle, { clean: true })
}