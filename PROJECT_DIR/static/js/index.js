import "../css/main.scss";
import "./google_maps";
import "./auto-complete"
import "./route_stops"

import buildWeather from "./skycons.js"
import { nodes } from "./nodes";
import "./touches.js";


buildWeather(icon)

window.onresize = () => {
    console.log("resized")
}

