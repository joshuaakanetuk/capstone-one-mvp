'use strict';
const basepath = 'https://api.themoviedb.org/3';
const imagebase = 'https://image.tmdb.org/t/p/original'
const imagebase92 = 'https://image.tmdb.org/t/p/w154'
const searchEndpoint = 'search/movie'
const movieEndpoint = 'movie'

const month = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Since the CSS for stars is backwards the default rating is 1
let starNum = 4;
let api = '84c0eecf8b46a2b1c3460770ad19e7fa';
let WATCHED = [];
let FAVORITES = [];

/* HELPER FUNCTIONS */
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
    if(found.length > 0)
        return found;
    else
        return "(no director)"
}

function convertMovieOBJ(obj) {
    //${(obj[1].backdrop_path) ? "" : "padding-top: 26.25%;"}
    return `<section id="movie_detail"> <section id="movie-backdrop-container" style=" margin-bottom: 10px;background-image: url('${imagebase + obj[1].backdrop_path}')"> <div id="movie_backdrop"></div> </section> 
    <section class="content pad" style="margin-top: -200px;"><div class="movie_poster" style="margin-bottom: 20px;"> <img src="${imagebase92 + obj[1].poster_path}" /> </div><div class="movie_info"> <h2>${obj[1].title + " (" + obj[1].release_date.substring(0, 4) + ")"}</h2><small style="margin-bottom: 10px;">dir. ${findInArray(obj[0].crew)[0].name} — ${obj[1].runtime} mins</small> <div style="color: lightgreen;margin-top: 10px;" class="tagline"><small>${obj[1].tagline}</small></div><div class="times_watched" style="margin-bottom: 10px;    margin-top: 10px;">Watched <b>${beenWatchedNumbner(obj[0].id)}</b> time(s)</div> </div>
    <div class="movie_overview" style="margin-bottom: 40px;">${obj[1].overview}</div>
    <div class="movie_cast"> 
    <small>CAST</small> 
    <ul style="display: flex; flex-wrap: wrap;">${castToList(obj[0].cast)}</ul></div><div class="movie_crew"> 
    <small>CREW</small> 
    <ul style="display: flex; flex-wrap: wrap;">${castToList(obj[0].crew)}</ul> </div> <div class="imdb">More Info: <a href="https://www.imdb.com/title/${obj[1].imdb_id}">IMDb</a</div> </section> </section>`
}

function watchedList() {
    var reverse = WATCHED;
    reverse = reverseArray(reverse);
    const renderWatchList = reverse.map(watch => watchToString(watch)).join('');
    let watchedContain = `<section id="recent" class="pad"> <span id="recent_header"> <small>RECENTLY WATCHED:</small> <small class="exportButton" style="right: 0; position: absolute; text-decoration: underline;">EXPORT</small> </span><section id="recent_watched"><ul>${renderWatchList}</ul></section></section>`;
    $('main').append(watchedContain);
}

function watchToString(obj) {
    return `<li data-id="${obj.id}"><div class="" style="position: relative; display: flex; flex-direction: column; text-align: center;"><span class="unwatched hidden">X</span><div class="movie_poster" data-movie-id=${obj.movie.movie_id} style="background-image: url('${obj.movie.movie_poster}')"></div><span class="edit--button" style="text-decoration: underline; margin-top: 5px;">Edit</span> </div><div class="movie_info"> <h1>${obj.movie.movie_title + " (" + obj.movie.movie_year + ")"} </h1> <small>dir. ${obj.movie.movie_dir}</small><div style="margin-top: 10px; word-break: break-all;">${obj.review_content}</div><div style="margin-top: 10px; font-size: 14px;">Watched on <b>${dateToString(obj.date_watched)}</b></div> <div class="movie_stars" style="margin-top: 10px; font-size: 14px;">${obj.star_count} <i class="fa fa-star" aria-hidden="true"></i> </div></div> </li>`;
}


function checkLocalStorage() {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        // Store


    } else {
        alert('Watched has an autosave feature for devices, but since your browser doesn\'t support it you won\'t be able to save your watched history without exporting manually.');
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

function onClickHandler() {
    $('#favorite__drawer').on('click', 'li', function (e) {
        if (e.currentTarget.dataset.movieId) {
            window.scrollTo(0,0); 
            renderMovieDetail(e.currentTarget.dataset.movieId);
        }

    });


    $('#favorite__drawer li').hover(function (e) {
        $(this).find('.unfavorite').toggleClass('hidden');
    });

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

function onStarClick() {
    $('.rating span').on('click', function (e) {
        starNum = 1;
        // e.stopPropagation();
        let ind = $('.rating span').index(this);
        starFill(ind);

    });
}

function onNavClick() {
    $('#addbutton').off();
    $('#addbutton').on('click', function (e) {
        e.stopPropagation();
        renderSearchOverlay();
        overlayListener();
        
    });
}

function onEditButtonClick() {
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


function onDeleteButtonClick() {
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

function goHome() {
    $('#gobackbutton').on('click', function (e) {
        e.stopPropagation();
        renderHomeScreen();
    });
}

function onClickSearchOverlay() {
    $('#results').on('click', 'li', function (e) {
        fetchHelp(movieEndpoint, e.currentTarget.dataset.movieId + "/credits", '')
            .then(data => {
                if(data.crew[0])
                    renderWatchDetail(e.currentTarget.dataset, $(this).find('img').get()[0].src, findInArray(data.crew)[0].name)
                else
                    renderWatchDetail(e.currentTarget.dataset, $(this).find('img').get()[0].src, "(no director)")

            })
            .catch(err => console.log(err))

    });


}


function movieFetch(id) {
    return Promise.all([fetchHelp(movieEndpoint, id + "/credits", ''), fetchHelp(movieEndpoint, id, '')]).then((values) => {
        return values;
    });
}


function save() {
    let watch_string = JSON.stringify(WATCHED);
    localStorage.setItem("WATCHED", watch_string);
}

function downloadObjectAsJson(){
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
                if(!isFavorite) {
                    newfav = element.movie;
                        newfav.id = element.id;
                        FAVORITES.push(newfav);
                    
                }
            }

        }
    });
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

/* COMPONENT RENDER FUNCTIONS */
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
    onClickHandler();
}
function renderRecent(num) {
    //render a certain number of items
    watchedList();
}

/* VIEW RENDER FUNCTIONS */
function renderHomeScreen() {
    $('#ui').html('Click the + to add a movie!');
    $('#overlay').toggleClass('hidden');
    overlayListener();


    
    $('main').css('padding-top', '85px');
    $('#addbutton').off();
    read();
    renderFavorites();
    renderRecent();
    onEditButtonClick();
    onDeleteButtonClick();
    onExportButtonClick();
    $('#recent_watched div').hover(function (e) {
        $(this).find('.unwatched').toggleClass('hidden')
    });


    onNavClick();
    $('#recent_watched').on('click', '.movie_poster', function (e) {
        window.scrollTo(0,0); 
        renderMovieDetail(e.currentTarget.dataset.movieId);
    });

}

function renderMovieDetail(id) {
    $('main').css('padding-top', '0');
    movieFetch(id)
        .then(data => convertMovieOBJ(data))
        .then(str => {
            $('main').html(str);
        })
        .catch(err => console.log(err));
    goHome();
}

function overlayListener() {
    $('#overlay').on('click', function (e) {
        e.stopPropagation();
        if ((e.target.id) == 'overlay') {
            $('#overlay').toggleClass('hidden');
            $("#overlay").off()
            $('#ui').off();
            onNavClick();
        }
        else {
        }
    });
}

function mapSearchList(arr) {
    arr = arr.slice(0, 3);
    return arr.map(watch => `<li data-movie-id="${watch.id}" data-movie-title="${watch.title}" data-movie-release="${watch.release_date.substring(0, 4)}"><div class="results--item"><div><img src="${(watch.poster_path) ? imagebase92 + watch.poster_path : "http://placehold.it/34x54?text=" + watch.title}" /></div><span>${watch.title} (${watch.release_date.substring(0, 4)})</span></div></li>`);
}

function renderSearchOverlay() {

    $('#overlay').toggleClass('hidden');
    $('#ui').html('<div class="overlay-search"> <div class="search--group"> <input autofocus id="name" name="search" placeholder="Search!" > <i class="fa fa-search fa"></i></div><ul id="results"> </ul> </div>');
    $('#name').focus();


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

function renderWatchDetail(obj) {
    let img = arguments[1] || "not found";
    let dir = arguments[2] || "not found";
    const currentTime = new Date();
    if ('id' in obj) {
        console.log("ALREADY AN OBJECT")
        $('#overlay').toggleClass('hidden');
        overlayListener();
        $('#ui').html(`<div class="over " style="width: 329px;background-color: white; padding: 16px; color: black;"><div class="js-watch-diary"><img style="width: 32px;" src="${obj.movie.movie_poster}"/><div style="display: flex; flex-direction: column" class=""><span>${obj.movie.movie_title} (${obj.movie.movie_year})</span><span>${obj.movie.movie_dir}</span></div></div><br><div style="justify-content: center; font-size: 15px;">Date Watched: <input type="date" id="date-watched" name="date-watched" value="${dateForInput(obj.date_watched)}"/> </div><textarea wrap="hard" id="reviewContent" style="margin-top: 10px;">${obj.review_content}</textarea><div style="display: flex; justify-content: space-between; margin-top: 10px;"><div class="rating"><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div><div><label for="favorite">Favorite? </label><input type="checkbox" id="favorite" name="favorite" ${(obj.favorite) ? 'checked' : ""}></div></div><input class="" style="margin-top: 10px" type="button" value="Update" /></div>`)
        onStarClick();
        starFill(5 - obj.star_count);

        $('#ui').on('click', 'input[type=button]', function (e) {
            WATCHED[obj.id].favorite = ($('#favorite').is(':checked'));
            WATCHED[obj.id].star_count = (5 - starNum);
            WATCHED[obj.id].review_content = ($('#reviewContent').val() === undefined ? " " : $('#reviewContent').val());
            console.log($('#reviewContent').val() )
            findFavorites();
            $('#ui').off();
            $('#overlay').toggleClass('hidden');
            save();
            renderHomeScreen();
            
            overlayListener();
            onNavClick();
            $('#ui').html('');
        });
    }
    else {

        $('#ui').html(`<div class="over " style="width: 329px;background-color: white; padding: 16px; color: black;"><div class="js-watch-diary"><img style="width: 32px;" src="${img}"/><div style="display: flex; flex-direction: column" class=""><span>${obj.movieTitle} (${obj.movieRelease})</span>${(arguments[2]) ? "<span>" + arguments[2] + "</span>" : ""}</div></div><br><div style="justify-content: center; font-size: 15px;">Date Watched: <input type="date" id="date-watched" name="date-watched" value="${dateForInput(currentTime)}"/> </div><textarea wrap="hard" id="reviewContent" style="margin-top: 10px;"></textarea><div style="display: flex; justify-content: space-between; margin-top: 10px;"><div class="rating"><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div><div><label for="favorite">Favorite? </label><input type="checkbox" id="favorite" name="favorite"></div></div><input class="" style="margin-top: 10px" type="button" value="Add" /></div>`)
        onStarClick();
        starFill(5 - 1);

        $('#ui').on('click', 'input[type=button]', function (e) {
            WATCHED.push({
                id: WATCHED.length,
                date_watched: currentTime,
                favorite: ($('#favorite').is(':checked')),
                star_count: 5 - starNum,
                review_content: ($('#reviewContent').val() === undefined ? "" : $('#reviewContent').val()),
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
            $('#overlay').toggleClass('hidden');
            save();
            renderHomeScreen();
            
            overlayListener();
            onNavClick();
            

        });

    }

}


function init() {
    checkLocalStorage();
    renderHomeScreen();
}

$(init);

