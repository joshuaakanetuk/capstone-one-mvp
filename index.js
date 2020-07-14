'use strict';

const basepath = 'https://api.themoviedb.org/3';
const imagebase = 'https://image.tmdb.org/t/p/w500'
const imagebase92 = 'https://image.tmdb.org/t/p/w92'
const searchEndpoint = 'search/movie'
const movieEndpoint = 'movie'

const month = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
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
        date_watched: 'Mon Jul 13 2020 20:33:54 GMT-0400 (Eastern Daylight Time)',
        favorite: false,
        star_count: 4,
        review_content: 'helelelelelellelel.e.ef,sdfl,dsnm hjdsklfhjdsklfjhkldsjfkl',
        movie: {
            movie_id: 505600,
            movie_title: `Booksmart`,
            movie_poster: `${imagebase92}/micaVOa1UZsdzs4fKGA67ZMGOzc.jpg`,
            movie_dir: `Olivia Wilde`,
            movie_year: ``
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
        movie_poster: ``,
        movie_dir: `Olivia Wilde`,
        movie_year: ``
    }
}

let favorite = {
    movie_id: "",
    movie_title: "",
    movie_poster: ""
}


/* HELPER FUNCTIONS */
function dateToString(str) {
    let newDate = new Date(str);
    return month[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear();
}

function doubleDigits(int) {

    if (int < 10)
        return `0${int}`
    else
        return int

}

function dateForInput(str) {
    let newDate = new Date(str);
    return `${newDate.getFullYear()}-${doubleDigits(newDate.getMonth())}-${doubleDigits(newDate.getDate())}`
}

function reverseArray(arr) {
    var newArray = [];
    for (var i = arr.length - 1; i >= 0; i--) {
        newArray.push(arr[i]);
    }
    return newArray;
}


function fetchHelp(endpoint, path, q) {
    return fetch(`https://api.themoviedb.org/3/${endpoint}${(path) ? '/' + path : ''}?api_key=${api}&query=${q}`, { mode: 'cors' })
        .then(response => response.json())
        .catch(err => console.log(err))
}

function convertMovieOBJ(obj) {
    return `<section id="movie_detail"> <section id="movie-backdrop-container" style="background-image: url('${imagebase + obj.backdrop_path}')"> <div id="movie_backdrop"></div> </section> <div class="content"> <div class="movie_poster"> <img src="${imagebase92 + obj.poster_path}" /> </div> <div class="movie_info"> <h2>${obj.title}</h2><small>dir.</small> <small>${obj.runtime} mins</small> <div>Watched <b>10</b> times</div> </div><div class="movie_cast"> <small>CAST</small> <ul> <li> Kaitlyn Dever </li> <li> Beanie Feldstein </li> </ul> </div> </div> </section>`
}

function watchedList() {
    var reverse = WATCHED;
    reverse = reverseArray(reverse);
    const renderWatchList = reverse.map(watch => watchToString(watch)).join('');
    let watchedContain = `<section id="recent"> <span id="recent_header"> <small>RECENTLY WATCHED:</small> <small style="right: 0; position: absolute; text-decoration: underline;">EXPORT</small> </span><section id="recent_watched"><ul>${renderWatchList}</ul></section></section>`;
    $('main').append(watchedContain);

}

function watchToString(obj) {
    return `<li><div class="movie_poster" data-movie-id=${obj.movie.movie_id} style="background-image: url('${obj.movie.movie_poster}')"></div> <div class="movie_info"> <h1>${obj.movie.movie_title}</h1> <small>dir. ${obj.movie.movie_dir}</small> <br><br><div>Watched on ${dateToString(obj.date_watched)}</div> <div style="word-break: break-all;">${obj.review_content}</div><div class="movie_stars">${obj.star_count} <i class="fa fa-star" aria-hidden="true"></i> </div></div> </li>`;
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
        if (e.currentTarget.dataset.movieId)
            renderMovieDetail(e.currentTarget.dataset.movieId);

    });
}


function onStarClick() {
    let starCount = 0;
    $('.rating span').on('click', function (e) {
        // e.stopPropagation();
        let ind = $('.rating span').index(this);
        let arrofstars = document.querySelectorAll('.rating span')
        starCount = ind;
        console.log(starCount)
        for(var i = 4; i >= ind; i--) {
            $(arrofstars[i]).addClass('rating--selected');
            
        }
        for(var i = 0; i < ind; i++) {
            $(arrofstars[i]).removeClass('rating--selected');
        }

    });
}

function onNavClick() {
    $('#addbutton').on('click', function (e) {
        e.stopPropagation();
        renderSearchOverlay();
        overlayListener();
    });
}

function goHome() {
    $('nav').on('click', function (e) {
        e.stopPropagation();
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
    let lis = ``;
    for (let i = 0; i < 5; i++) {
        if (!FAVORITES[i])
            lis += `<li class="placeholder"></li>`
        else
            lis += `<li data-movie-id=${FAVORITES[i].movie_id}><img src="${FAVORITES[i].movie_poster}"/></li>`
    }
    let favorites = `<section id="favorites" class="dropzone"><small>FAVORITES:</small><ul id="favorite__drawer">${lis}</ul></section>`;
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
    onNavClick();
    console.log(WATCHED)
    
    $('#recent_watched').on('click', '.movie_poster', function (e) {
        renderMovieDetail(e.currentTarget.dataset.movieId);
        // renderSearchOverlay();

    });

}

function renderMovieDetail(id) {
    //fetchHelp(movieEndpoint, id + "/credits", '')    

    Promise.all([fetchHelp(movieEndpoint, id + "/credits", '')  , fetchHelp(movieEndpoint, id, '')]).then((values) => {
        console.log(values);
      });

    fetchHelp(movieEndpoint, id, '')
        .then(data => {
            console.log(data)
            // convertMovieOBJ(data) 
        })
        .then(str => {
            // $('main').html(str)

        })
        .catch(err => console.log(err));
    goHome();
}

// function renderAllWatchedScreen() {

// }

// function overlayListener() {
//     $('#overlay').on('click', function (e) {
//         e.stopPropagation();
//         console.log(e);
//         if ((e.target.id) == 'overlay') {
//             $('#overlay').toggleClass('hidden');
//             $("#overlay").off()
//         }
//         else {
//         }
//     });
// }

function mapSearchList(arr) {
    arr = arr.slice(0, 3);
    console.log(arr)
    return arr.map(watch => `<li data-movie-id="${watch.id}" data-movie-title="${watch.title}" data-movie-release="${watch.release_date.substring(0, 4)}"><div class="results--item"><div><img src="${imagebase + watch.poster_path}" /></div><span>${watch.title} (${watch.release_date.substring(0, 4)})</span></div></li>`);
}

function renderSearchOverlay() {
    
    $('#overlay').toggleClass('hidden');
    $('#ui').html('<div class="overlay-search"> <div class="search--group"> <input id="name" name="search" placeholder="Search!" > <i class="fa fa-search fa"></i></div><ul id="results"> </ul> </div>');
    

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
    $('#ui').html(`<div class="over " style="width: 329px;background-color: white; padding: 8px; color: black;"><div class="js-watch-diary"><img style="width: 32px;" src="${img}"/><span>${obj.movieTitle} (${obj.movieRelease})</span></div><br><div style="justify-content: center; font-size: 15px;">Date Watched: <input type="date" id="date-watched" name="date-watched" value="${dateForInput(currentTime)}"/> </div><textarea wrap="off" id="reviewContent" style="margin-top: 10px;"></textarea><div class="rating"><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div><input type="checkbox" id="favorite" name="favorite"><input type="button" value="Add" /></div>`)
    onStarClick();

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
        $('#ui').html('<label for="name">Name: </label> <input id="name"> <ul id="results"> </ul>');
        overlayListener();
        onNavClick();

    });

}





function init() {
    checkLocalStorage();
    renderHomeScreen();
}


// Need listeners on each view switch

//$('textarea').autoResize();
// window.onload = (e) => {
//     init();
// }

$(init);

