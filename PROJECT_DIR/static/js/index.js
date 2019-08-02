import "../css/main.scss";
// // import "../ionic/core/dist/ionic.js";
// import "../ionic/core/dist/ionic/ionic.esm.js";
import "./google_maps";
import { drawers, search } from './nodes';
import "./auto-complete"
import "./stops"
import "./routes"
import "./journey_planner"
import "./sightseeing.js"
import buildWeather from "./skycons.js"
import { nodes } from "./nodes";
import "./touches.js";
import "./favourites";



buildWeather(icon);

window.onresize = () => {
    console.log("resized")
};


// setTimeout(function () {
//     let viewheight = $(window).height();
//     let viewwidth = $(window).width();
//     let viewport = document.querySelector("meta[name=viewport]");
//     viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
// }, 50);

const { searchButton, searchContainer } = search

export const searchToggle = () => {
    searchContainer.classList.toggle("search-out")
    searchButton.classList.toggle("search-out-button")
}

searchButton.addEventListener('click', searchToggle);

$('.temperature-show').hide()

$(".weather-button").click(() => {
    if ($('#icon2').css('display') !== "none"){
        $('#icon2').fadeOut(() => {
            $('.temperature-show').fadeIn();
        });
        
    } else {
        $('.temperature-show').fadeOut(() => {
            $('#icon2').fadeIn();
        });
    }
});