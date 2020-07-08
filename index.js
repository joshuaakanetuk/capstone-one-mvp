'use strict';

let FAVORITES = [];
let WATCHED = [];
// let watch = {
//     date_watched = '',
//     star_count = '',
//     review_content = ''
// }


/* HELPER FUNCTIONS */
function checkLocalStorage() {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        // Store
        localStorage.setItem("FAVORITES", "string");
        // Retrieve
        document.getElementById("result").innerHTML = localStorage.getItem("FAVORITES");
    } else {
        alert('Watched has an autosave feature for devices, but since your browser doesn\'t support it you won\'t be able to save your watched history without exporting manually.');
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

/* RENDER FUNCTIONS */
function renderHomeScreen() {

}

function renderMovieDetail() {

}

function renderAllWatchedScreen() {

}

function renderSearchOverlay() {

}

function renderWatchDetail() {

}


function init() {
    checkLocalStorage();
}


window.onload = (e) => {
    init();
}

// $('init');


