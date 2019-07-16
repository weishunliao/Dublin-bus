import "../css/main.scss";
import "./google_maps";
import { drawers, search } from './nodes';

import buildWeather from "./skycons.js"
import { nodes } from "./nodes";
import "./touches.js";


buildWeather(icon)

window.onresize = () => {
    console.log("resized")
}


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