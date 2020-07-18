'use strict'
const basepath = 'https://api.themoviedb.org/3';
const imagebase = 'https://image.tmdb.org/t/p/original'
const imagebase92 = 'https://image.tmdb.org/t/p/w154'
const searchEndpoint = 'search/movie'
const movieEndpoint = 'movie'

const day = 60 * 60 * 24 * 1000;
const month = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Since the CSS for stars is backwards the default rating is 1
let starNum = 4;
let api = '84c0eecf8b46a2b1c3460770ad19e7fa';
let WATCHED = [];
let FAVORITES = [];

/* HELPER FUNCTIONS and UTILS */
function dateToString(str) {
    let newDate = new Date(str);
    return month[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear();
}

function beenWatchedNumbner(id) {
    let num = 0;
    WATCHED.forEach(element => {
        if (element.movie.movie_id == id)
            num++;
    });
    return num;
}

function doubleDigits(int) {
    if (int < 10)
        return `0${int}`
    else
        return int
}

function dateForInput(str) {
    let newDate = new Date(str);
    return `${newDate.getFullYear()}-${doubleDigits(newDate.getMonth()+1)}-${doubleDigits(newDate.getDate())}`
}

function reverseArray(arr) {
    var newArray = [];
    for (var i = arr.length - 1; i >= 0; i--) {
        newArray.push(arr[i]);
    }
    return newArray;
}

function requestAPIHandler(endpoint, path, q) {
    return fetch(`https://api.themoviedb.org/3/${endpoint}${(path) ? '/' + path : ''}?api_key=${api}&query=${q}`, { mode: 'cors' })
        .then(response => response.json())
        .catch(err => console.log(err))
}

function castToString(obj) {
    return `<li>${obj.name}</li>`;
}

function castToList(arr) {
    arr = arr.slice(0, 16);
    const castList = arr.map(member => castToString(member)).join('');
    return castList;
}


function findInArray(arr) {
    let found = arr.filter(word => word.job === "Director");
    if (found.length > 0)
        return found;
    else
        return "(no director)"
}

function returnWatchString(obj) {
    return `<li data-id="${obj.id}"><div class="" style="position: relative; display: flex; flex-direction: column; text-align: center;"><span class="unwatched hidden">X</span><div class="movie_poster" data-movie-id=${obj.movie.movie_id} style="background-image: url('${obj.movie.movie_poster}')"></div><span class="edit--button" style="text-decoration: underline; margin-top: 5px;">Edit</span> </div><div class="movie_info"> <h1>${obj.movie.movie_title + " (" + obj.movie.movie_year + ")"} </h1> <small>dir. ${obj.movie.movie_dir}</small><div style="margin-top: 10px; word-break: break-all;">${obj.review_content}</div><div style="margin-top: 10px; font-size: 14px;">Watched on <b>${dateToString(obj.date_watched)}</b></div> <div class="movie_stars" style="margin-top: 10px; font-size: 14px;">${obj.star_count} ★ </div></div> </li>`;
}

function getMovieDetailsWithCredits(id) {
    return Promise.all([requestAPIHandler(movieEndpoint, id + "/credits", ''), requestAPIHandler(movieEndpoint, id, '')]).then((values) => {
        return values;
    });
}

function checkLocalStorage() {
    // Check browser support for Local Storage
    // Most modern browsers support
    if (typeof (Storage) !== "undefined") {
        // Store
    } else {
        alert('Watched has an autosave feature for devices, but since your browser doesn\'t support it you won\'t be able to save your watched history without exporting manually.');
    }
}

function starFill(int) {
    let arrofstars = document.querySelectorAll('.rating span')
    starNum = int;
    for (var i = 4; i >= int; i--) {
        $(arrofstars[i]).addClass('rating--selected');

    }
    for (var i = 0; i < int; i++) {
        $(arrofstars[i]).removeClass('rating--selected');
    }

}

function save() {
    let watch_string = JSON.stringify(WATCHED);
    localStorage.setItem("WATCHED", watch_string);
}

function read() {
    if (localStorage.getItem(("WATCHED"))) {
        WATCHED = JSON.parse(localStorage.getItem(("WATCHED")))
    }
    else {
        WATCHED = [];
    }
    findFavorites();
}

function removeWatched(id) {
    WATCHED.splice(id, 1);
    WATCHED.forEach(function (e, i) {
        e.id = i;
    });
    findFavorites();
    save();
    renderHomeScreen();
}

function returnSearchResults(arr) {
    arr = arr.slice(0, 3);
    return arr.map(watch => `<li data-movie-id="${watch.id}" data-movie-title="${watch.title}" data-movie-release="${watch.release_date.substring(0, 4)}"><div class="results--item"><div><img src="${(watch.poster_path) ? imagebase92 + watch.poster_path : "http://placehold.it/34x54?text=" + watch.title}" /></div><span>${watch.title} (${watch.release_date.substring(0, 4)})</span></div></li>`);
}

/* EVENT LISTENERS */
function onHomeButtonClick() {
    $('#gobackbutton').on('click', function (e) {
        e.stopPropagation();
        renderHomeScreen();
    });
}

function onClickOutOfOverlay() {
    $('#overlay').on('click', function (e) {
        e.stopPropagation();
        if ((e.target.id) == 'overlay') {
            $('#overlay').addClass('hidden');
            $("#overlay").off()
            $('#ui').off();
            onNavClick();
        }
        else {
        }
    });
}

function favoriteEventListeners() {
    $('#favorite__drawer').on('click', 'li', function (e) {
        if (e.currentTarget.dataset.movieId) {
            window.scrollTo(0, 0);
            renderMovieDetail(e.currentTarget.dataset.movieId);
        }

    });


    $('#favorite__drawer li').hover(function (e) {
        $(this).find('.unfavorite').toggleClass('hidden');
    });

}

function onClickGuide() {
    $('.guide').on('click', function() {
        $('#ui').html('Click the + to add a movie!<br>Hover over (on double tap on mobile) to delete a movie from watch history or unfavorite.');
        $('#overlay').removeClass('hidden');
        onClickOutOfOverlay();
    })
}

function deleteButtonListeners() {
    $('.unwatched').on('click', function (e) {
        e.stopPropagation();
        removeWatched($(this).closest('li').get()[0].dataset.id);
    });

    $('.unfavorite').on('click', function (e) {
        e.stopPropagation();
        WATCHED[$(this).closest('li').get()[0].dataset.id].favorite = false;
        findFavorites();
        save();
        renderHomeScreen();
    });

}

function onSearchOverlaySelectionClick() {
    $('#results').on('click', 'li', function (e) {
        requestAPIHandler(movieEndpoint, e.currentTarget.dataset.movieId + "/credits", '')
            .then(data => {
                if (data.crew[0])
                    renderWatchDetail(e.currentTarget.dataset, $(this).find('img').get()[0].src, findInArray(data.crew)[0].name)
                else
                    renderWatchDetail(e.currentTarget.dataset, $(this).find('img').get()[0].src, "(no director)")
            })
            .catch(err => console.log(err))
    });
}

function onStarClick() {
    $('.rating span').on('click', function (e) {
        starNum = 1;
        let ind = $('.rating span').index(this);
        starFill(ind);

    });
}

function onNavClick() {
    $('#addbutton').off();
    $('#addbutton').on('click', function (e) {
        e.stopPropagation();
        renderSearchOverlay();
        onClickOutOfOverlay();

    });
}

function onWatchEditButtonClick() {
    $('.edit--button').on('click', function (e) {
        e.stopPropagation();
        renderWatchDetail(WATCHED[(this).closest('li').dataset.id]);
    });
}

function onExportButtonClick() {
    $('.exportButton').on('click', function (e) {
        downloadObjectAsJson();
    });
}




function downloadObjectAsJson() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(WATCHED));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "watched.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


function findFavorites() {
    FAVORITES = [];
    let newfav = "";
    let isFavorite = false;
    WATCHED.forEach(function (element, ind) {
        if (element.favorite == true) {
            if (FAVORITES.length == 0) {
                newfav = element.movie;
                newfav.id = ind;
                FAVORITES.push(element.movie);
            }
            else {
                FAVORITES.forEach(favorite => {
                    if (element.movie.movie_id == favorite.movie_id && FAVORITES.length < 5) {
                        isFavorite = true;
                    }
                });
                if (!isFavorite) {
                    newfav = element.movie;
                    newfav.id = element.id;
                    FAVORITES.push(newfav);

                }
            }

        }
    });
}

/* COMPONENT RENDER FUNCTIONS */
function renderSearchOverlay() {
    $('#overlay').toggleClass('hidden');
    $('#ui').html('<div class="overlay-search"> <div class="search--group"> <input autofocus id="name" name="search" placeholder="Search!" > <i class="fa fa-search fa"></i></div><ul id="results"> </ul> </div>');
    $('#overlay').on('transitionend',
        function (e) {

            $('#name').focus()

        });

    $('#name').on('input', function () {
        requestAPIHandler(searchEndpoint, '', $('#name').val())
            .then(d => returnSearchResults(d.results))
            .then(data => {
                $('#results').html(data)

            })
            .catch(err => console.log(err))
    });

    onSearchOverlaySelectionClick();

};

function renderFavorites() {
    let lis = ``;
    for (let i = 0; i < 5; i++) {
        if (FAVORITES) {
            if (!(FAVORITES[i]))
                lis += `<li class="placeholder"></li>`
            else
                lis += `<li data-id=${FAVORITES[i].id} data-movie-id=${FAVORITES[i].movie_id}><span class="unfavorite hidden">X</span><img src="${FAVORITES[i].movie_poster}"/></li>`
        }
    }
    let favorites = `<section id="favorites" class="pad"><small>FAVORITES:</small><ul id="favorite__drawer">${lis}</ul></section>`;
    $('main').html(favorites);
    favoriteEventListeners();
}

function returnMovieDetail(obj) {
    return `<section id="movie_detail"> <section id="movie-backdrop-container" style=" margin-bottom: 10px;background-image: url('${imagebase + obj[1].backdrop_path}')"> <div id="movie_backdrop"></div> </section> 
    <section class="content pad" style="margin-top: -200px;"><div class="movie_poster" style="margin-bottom: 20px;"> <img src="${imagebase92 + obj[1].poster_path}" /> </div><div class="movie_info"> <h2>${obj[1].title + " (" + obj[1].release_date.substring(0, 4) + ")"}</h2><small style="margin-bottom: 10px;">dir. ${findInArray(obj[0].crew)[0].name} — ${obj[1].runtime} mins</small> <div style="color: lightgreen;margin-top: 10px;" class="tagline"><small>${obj[1].tagline}</small></div><div class="times_watched" style="margin-bottom: 10px;    margin-top: 10px;">Watched <b>${beenWatchedNumbner(obj[0].id)}</b> time(s)</div> </div>
    <div class="movie_overview" style="margin-bottom: 40px;">${obj[1].overview}</div>
    <div class="movie_cast"> 
    <small>CAST</small> 
    <ul style="display: flex; flex-wrap: wrap;">${castToList(obj[0].cast)}</ul></div><div class="movie_crew"> 
    <small>CREW</small> 
    <ul style="display: flex; flex-wrap: wrap;">${castToList(obj[0].crew)}</ul> </div> <div class="imdb">More Info: <a href="https://www.imdb.com/title/${obj[1].imdb_id}">IMDb</a</div> </section> </section>`
}


function renderRecentWatched() {
    var reverse = WATCHED;
    reverse = reverseArray(reverse);
    const renderWatchList = reverse.map(watch => returnWatchString(watch)).join('');
    let watchedContain = `<section id="recent" class="pad"> <span id="recent_header"> <small>RECENTLY WATCHED:</small> <small class="exportButton" style="right: 0; position: absolute; text-decoration: underline;">EXPORT</small> </span><section id="recent_watched"><ul>${renderWatchList}</ul></section></section>`;
    $('main').append(watchedContain);
}

/* VIEW RENDER FUNCTIONS */
function renderHomeScreen() {
    onClickGuide();
    $('#overlay').addClass('hidden');
    onClickOutOfOverlay();
    $('main').css('padding-top', '85px');
    $('#addbutton').off();
    read();
    renderFavorites();
    renderRecentWatched();
    onWatchEditButtonClick();
    deleteButtonListeners();
    onExportButtonClick();
    $('#recent_watched div').hover(function (e) {
        $(this).find('.unwatched').toggleClass('hidden')
    });


    onNavClick();
    $('#recent_watched').on('click', '.movie_poster', function (e) {
        window.scrollTo(0, 0);
        renderMovieDetail(e.currentTarget.dataset.movieId);
    });

}

function renderMovieDetail(id) {
    $('main').css('padding-top', '0');
    getMovieDetailsWithCredits(id)
        .then(data => returnMovieDetail(data))
        .then(str => {
            $('main').html(str);
        })
        .catch(err => console.log(err));
    onHomeButtonClick();
}



function renderWatchDetail(obj) {
    let img = arguments[1] || "not found";
    let dir = arguments[2] || "not found";
    const currentTime = new Date();
    // console.log(currentTime)
    if ('id' in obj) {
        $('#overlay').removeClass('hidden');
        onClickOutOfOverlay();
        $('#ui').html(`<div class="over " style="width: 329px;background-color: white; padding: 16px; color: black;"><div class="js-watch-diary"><img style="width: 32px;" src="${obj.movie.movie_poster}"/><div style="display: flex; flex-direction: column" class=""><span>${obj.movie.movie_title} (${obj.movie.movie_year})</span><span>${obj.movie.movie_dir}</span></div></div><br><div style="justify-content: center; font-size: 15px;">Date Watched: <input type="date" id="date-watched" name="date-watched" value="${dateForInput(obj.date_watched)}"/> </div><textarea wrap="hard" placeholder="Add your thoughts about the movie!" id="reviewContent" style="margin-top: 10px;">${obj.review_content}</textarea><div style="display: flex; justify-content: space-between; margin-top: 10px;"><div class="rating"><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div><div><label for="favorite">Favorite? </label><input type="checkbox" id="favorite" name="favorite" ${(obj.favorite) ? 'checked' : ""}></div></div><input class="" style="margin-top: 10px" type="button" value="Update" /></div>`)
        onStarClick();
        starFill(5 - obj.star_count);

        $('#ui').on('click', 'input[type=button]', function (e) {
            $('#ui').off();
            WATCHED[obj.id].favorite = ($('#favorite').is(':checked'));
            WATCHED[obj.id].star_count = (5 - starNum);
            WATCHED[obj.id].date_watched = (new Date(document.getElementById("date-watched").valueAsDate.getTime() + day))
            WATCHED[obj.id].review_content = ($('#reviewContent').val() === 'undefined' ? " " : $('#reviewContent').val());
            $("#overlay").toggleClass('hidden');
            findFavorites();
            save();
            renderHomeScreen();
            onClickOutOfOverlay();
            onNavClick();
        });
    }
    else {

        $('#ui').html(`<div class="over " style="width: 329px;background-color: white; padding: 16px; color: black;"><div class="js-watch-diary"><img style="width: 32px;" src="${img}"/><div style="display: flex; flex-direction: column" class=""><span>${obj.movieTitle} (${obj.movieRelease})</span>${(arguments[2]) ? "<span>" + arguments[2] + "</span>" : ""}</div></div><br><div style="justify-content: center; font-size: 15px;">Date Watched: <input type="date" id="date-watched" name="date-watched" value="${dateForInput(currentTime)}"/> </div><textarea placeholder="Add your thoughts about the movie!" wrap="hard" id="reviewContent" style="margin-top: 10px;"></textarea><div style="display: flex; justify-content: space-between; margin-top: 10px;"><div class="rating"><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div><div><label for="favorite">Favorite? </label><input type="checkbox" id="favorite" name="favorite"></div></div><input class="" style="margin-top: 10px" type="button" value="Add" /></div>`)
        onStarClick();
        starFill(5 - 1);

        $('#ui').on('click', 'input[type=button]', function (e) {
            WATCHED.push({
                id: WATCHED.length,
                date_watched: currentTime.toLocaleDateString(),
                favorite: ($('#favorite').is(':checked')),
                star_count: 5 - starNum,
                review_content: ($('#reviewContent').val() === undefined ? " " : $('#reviewContent').val()),
                movie: {
                    movie_id: obj.movieId,
                    movie_title: obj.movieTitle,
                    movie_poster: img,
                    movie_dir: dir,
                    movie_year: obj.movieRelease
                }

            });

            findFavorites();
            $('#ui').off();
            $('#ui').html('<label for="name">Name: </label> <input id="name"> <ul id="results"> </ul>');
            $('#overlay').addClass('hidden');
            save();
            renderHomeScreen();

            onClickOutOfOverlay();
            onNavClick();


        });

    }

}


function init() {
    checkLocalStorage();
    renderHomeScreen();
}

$(init);

