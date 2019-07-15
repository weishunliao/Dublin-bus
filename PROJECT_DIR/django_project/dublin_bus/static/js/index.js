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

searchButton.addEventListener('click', () => {
    searchContainer.classList.toggle("search-out")
    searchButton.classList.toggle("search-out-button")
})