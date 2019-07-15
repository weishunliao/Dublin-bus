import "../css/main.scss";
import "./google_maps";
import "./route_stops"
import "./auto-complete"
import "./slot_card"

import buildWeather from "./skycons.js"
import { nodes } from "./nodes";
import "./touches.js";


buildWeather(icon);

window.onresize = () => {
    console.log("resized")
};

