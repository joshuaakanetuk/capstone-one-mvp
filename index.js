'use strict';

const basepath = 'https://api.themoviedb.org/3';
const imagebase = 'https://image.tmdb.org/t/p/w500'
const searchEndpoint = 'search/movie'
const movieEndpoint = 'movie'
// const creditsEndpoint = 'credits'

let api = '84c0eecf8b46a2b1c3460770ad19e7fa';
let FAVORITES = [
    {
        movie_id: 505600,
        movie_title: `Booksmart`,
        movie_poster: `${imagebase}/micaVOa1UZsdzs4fKGA67ZMGOzc.jpg`
    },
    {
        movie_id: 419704,
        movie_title: `Ad Astra`,
        movie_poster: `${imagebase}/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg`
    }
];
let WATCHED = [
    {
        date_watched: 'July 20, 2020',
        favorite: false,
        star_count: 4,
        review_content: '',
        movie: {
            movie_id: 505600,
            movie_title: `Booksmart`,
            movie_poster: `${imagebase}/micaVOa1UZsdzs4fKGA67ZMGOzc.jpg`
        }
    },
    {
        date_watched: 'July 08, 2020',
        favorite: true,
        star_count: 3,
        review_content: '',
        movie: {
            movie_id: 419704,
            movie_title: `Ad Astra`,
            movie_poster: `${imagebase}/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg`
        }
    }
];

let watch = {
    date_watched: '',
    favorite: false,
    star_count: '',
    review_content: '',
    movie: {
        movie_id: '',
        movie_title: ``,
        movie_poster: ``
    }
}

let favorite = {
    movie_id: "",
    movie_title: "",
    movie_poster: ""
}


/* HELPER FUNCTIONS */
function fetchHelp(endpoint, path, q) {
    return fetch(`${basepath}/${endpoint}/${path}?api_key=${api}&query=${q}`)
        .then(response => response.json())
        .catch(err => console.log(err))
}

function convertMovieOBJ(obj) {
    return `<section id="movie_detail"> <section id="movie-backdrop-container" style="background-image: url('${imagebase + obj.backdrop_path}')"> <div id="movie_backdrop"></div> </section> <div class="content"> <div class="movie_poster"> <img src="${imagebase + obj.poster_path}" /> </div> <div class="movie_info"> <h2>${obj.title}</h2><small>dir.</small> <small>${obj.runtime} mins</small> <div>Watched <b>10</b> times</div> </div><div class="movie_cast"> <small>CAST</small> <ul> <li> Kaitlyn Dever </li> <li> Beanie Feldstein </li> </ul> </div> </div> </section>`
}

function watchedList() {
    const renderWatchList = WATCHED.map(watch => watchToString(watch));
    let watchedContain = `<section id="recent"> <span id="recent_header"> <h2>RECENT WATCHED:</h2> <small>MORE</small> </span><section id="recent_watched"><ul>${renderWatchList}</ul></section></section>`;
    $('main').append(watchedContain);

}

function watchToString(obj) {
    return `<li><div class="movie_poster" style="background-image: url('${obj.movie.movie_poster}')"></div> <div class="movie_info"> <h1>${obj.movie.movie_title}</h1> <small>dir. Oliva Wilde</small> <div>Watched on ${obj.date_watched}</div> <div>${obj.review_content}</div><div class="movie_stars"> ${obj.star_count}<i class="fa fa-star" aria-hidden="true"></i> </div> <div class="movie_watched_edit">Edit</div> </div> </li>`;
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
    $('#favorite__drawer').on('click', 'li', function (e) {
        renderMovieDetail(e.currentTarget.dataset.movieId);
        // renderSearchOverlay();

    });

    $('#addbutton').on('click', function (e) {
        renderSearchOverlay();

    });



}

function goHome() {
    $('nav').on('click', function (e) {
        renderHomeScreen();
    });
}

function onClickSearchOverlay() {
    $('#results').on('click', 'li', function (e) {
        // e.stopPropagation();
        renderWatchDetail(e.currentTarget.dataset, $(this).find('img').get()[0].src);
    });


}

/* COMPONENT RENDER FUNCTIONS */
function renderFavorites() {
    // <img src="" alt="${FAVORITES[i].movie_title} movie poster."/>
    let lis = ``;
    for (let i = 0; i < 5; i++) {
        if (!FAVORITES[i])
            lis += `<li>Placeholder</li>`
        else
            lis += `<li data-movie-id=${FAVORITES[i].movie_id} style="background-image: url('${FAVORITES[i].movie_poster}')"></li>`
    }
    let favorites = `<section id="favorites"><small>FAVORITES:</small><ul id="favorite__drawer">${lis}</ul></section>`;
    $('main').html(favorites);
    onClickHandler();
}
function renderRecent(num) {
    //render a certain number of items
    watchedList();
}

/* VIEW RENDER FUNCTIONS */
function renderHomeScreen() {
    renderFavorites();
    renderRecent(1);
}

function renderMovieDetail(id) {
    fetchHelp(movieEndpoint, id, '')
        .then(data => convertMovieOBJ(data))
        .then(str => {
            $('main').html(str)

        })
        .catch(err => console.log(err));
    goHome();
}

function renderAllWatchedScreen() {

}

function mapSearchList(arr) {
    arr = arr.slice(0, 3);
    return arr.map(watch => `<li data-movie-id="${watch.id}" data-movie-title="${watch.title}"><div class="results_list"><div><img src="${imagebase + watch.poster_path}" /></div><span>${watch.title}</span></div></li>`);
}

function renderSearchOverlay() {
    $('#overlay').toggleClass('hidden');
    $('#ui').html('<label for="name">Name: </label> <input id="name"> <ul id="results"> </ul>');

    // $('#overlay').on('click', 'li', function (e) {
    //     // e.stopPropagation();
    //     console.log(e);
    //     $('#overlay').toggleClass('hidden');
    //     $("#overlay").off()
    // });

    $('#name').on('input', function () {
        fetchHelp(searchEndpoint, '', $('#name').val())
            .then(d => mapSearchList(d.results))
            .then(data => {
                $('#results').html(data)

            })
            .catch(err => console.log(err))
    });

    onClickSearchOverlay();

};

function renderWatchDetail(obj, img) {
    const currentTime = new Date();
    console.log(obj, img)
    //if existing watch
    $('#ui').html(`<div style="background-color: white; padding: 20px; color: black;" ><div>${obj.movieTitle}</div><br><img style="width: 32px;" src="${img}"/><br><div>Date Watched: ${currentTime}</div><textarea id="reviewContent"></textarea><input type="button" value="Add" /></div>`)

    $('#ui').on('click', 'input[type=button]', function (e) {
        WATCHED.push({
            date_watched: currentTime,
            favorite: false,
            star_count: 3,
            review_content: $('#reviewContent').val(),
            movie: {
                movie_id: obj.movieId,
                movie_title: obj.movieTitle,
                movie_poster: img
            }

        });

        $('#ui').off();
        $('#overlay').toggleClass('hidden');
        renderHomeScreen();

    });

}



function init() {
    checkLocalStorage();
    renderHomeScreen();
}


// window.onload = (e) => {
//     init();
// }

$(init);



