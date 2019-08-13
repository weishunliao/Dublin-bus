import "../css/main.scss";
// // import "../ionic/core/dist/ionic.js";
// import "../ionic/core/dist/ionic/ionic.esm.js";
import "./google_maps";
import { drawers, search, nodes } from './nodes';
import "./auto-complete"
import "./stops"
import "./routes"
import "./journey_planner"
import "./sightseeing.js"
import buildWeather from "./skycons.js"


import "./touches.js";
import "./favourites";



buildWeather(icon);


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