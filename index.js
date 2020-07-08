'use strict';

const basepath = 'https://api.themoviedb.org/3';
const imagebase = 'https://image.tmdb.org/t/p/w500'
const searchEndpoint = 'search/movie'
const movieEndpoint = 'movie'

let api = '84c0eecf8b46a2b1c3460770ad19e7fa';
let FAVORITES = [
    {
        movie_id: 505600,
        movie_title: `Booksmart`,
        movie_poster: `${imagebase}/micaVOa1UZsdzs4fKGA67ZMGOzc.jpg`
    }
];
let WATCHED = [];

let watch = {
    date_watched: '',
    star_count:'',
    review_content: '',
    movie: ''
}

let favorite = {
    movie_id: "",
    movie_title: "",
    movie_poster: ""
}


/* HELPER FUNCTIONS */
function fetchHelp(endpoint, path, q) {
    return fetch(`${basepath}/${endpoint}/${path}?api_key=${api}&${q}`)
    .then(response => response.json())
    .then(responseJson => console.log(responseJson))
    .catch(err => console.log(err))
}

function checkLocalStorage() {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        // Store
        localStorage.setItem("FAVORITES", "string");
        // Retrieve
        // document.getElementById("result").innerHTML = localStorage.getItem("FAVORITES");
    } else {
        alert('Watched has an autosave feature for devices, but since your browser doesn\'t support it you won\'t be able to save your watched history without exporting manually.');
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

function onClickHandler() {
    $('#favorite__drawer').on('click', 'li', function(e) {
        console.log(e.currentTarget.dataset.movieId);
        fetchHelp(movieEndpoint, e.currentTarget.dataset.movieId,'');
    });
}
/* COMPONENT RENDER FUNCTIONS */
function renderFavorites() {
    // <img src="" alt="${FAVORITES[i].movie_title} movie poster."/>
    let lis = ``;    
    for(let i=0; i < 5; i++) {
        if(!FAVORITES[i]) 
            lis+=`<li>Placeholder</li>`
        else
            lis+=`<li data-movie-id=${FAVORITES[i].movie_id} style="background-image: url('${FAVORITES[i].movie_poster}')"></li>`
    }
    let favorites = `<section id="favorites"><small>FAVORITES:</small><ul id="favorite__drawer">${lis}<ul></section>`;
    $('main').html(favorites);
    onClickHandler();
}
function renderRecent(num) {
    //render a certain number of items
}

/* VIEW RENDER FUNCTIONS */
function renderHomeScreen() {
    // renderFavorites();
}

function renderMovieDetail(id) {
    fetchHelp(movieEndpoint, 505600,'')
    // .then();


}

function renderAllWatchedScreen() {

}

function renderSearchOverlay() {

}

function renderWatchDetail() {

}



function init() {
    checkLocalStorage();
    renderHomeScreen();
}


// window.onload = (e) => {
//     init();
// }

$(init);



