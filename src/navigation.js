let page = 1;
let maxPage;
let infiniteScroll;
const initialLocalStorage = localStorage.getItem('liked_movies');

const navigator = () => {

    window.removeEventListener('scroll', infiniteScroll);

    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

const searchClick = () => {
    location.hash = '#search=' + searchFormInput.value;
}
const trendClick = () => {
    location.hash = '#trends';
}
const backClick = () => {
    history.back();
    // location.hash = '#home';
}

searchFormBtn.addEventListener('click', searchClick);

trendingBtn.addEventListener('click', trendClick);

arrowBtn.addEventListener('click', backClick);

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
// window.addEventListener('scroll', infiniteScroll);


function homePage() {
    const actualLocalStorage = localStorage.getItem('liked_movies');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');

    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    const arePickedFavMovie = initialLocalStorage == actualLocalStorage;

    if (arePickedFavMovie) {
        getTrendingPreview(TREND);
        getCategoriesPreview(GENRE);
    }

    getLikedMovies();

}

function categoriesPage() {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [categoryId, categoryName] = location.hash.split('=')[1].split("-");
    getMoviesByCategory(categoryId);
    headerCategoryTitle.innerHTML = categoryName;
    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
    window.addEventListener('scroll', infiniteScroll);
}

function movieDetailsPage() {

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}

function searchPage() {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);
    window.addEventListener('scroll', infiniteScroll);
    infiniteScroll = getPaginatedMoviesBySearch(query);
    window.addEventListener('scroll', infiniteScroll);
}

function trendsPage() {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    headerCategoryTitle.innerHTML = 'TENDENCIAS';

    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;
    window.addEventListener('scroll', infiniteScroll);
}