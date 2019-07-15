import "../css/main.scss";
import "./google_maps";
import "./route_stops"
import "./auto-complete"
import "./jquery-3.4.1.min"
import "./typeahead.jquery.min"
import "./bloodhound.min"
import "./typeahead.bundle.min"

import buildWeather from "./skycons.js"
import { nodes } from "./nodes";
import "./touches.js";


buildWeather(icon);

window.onresize = () => {
    console.log("resized")
};

