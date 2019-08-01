import {markers, map} from "./google_maps";
import {create_favourite_route_card, create_favourite_stop_card} from "./favourites";
import {controller} from "./stops";
// import {window_height} from "./stops";
//
// document.getElementById("routes__content__wrapper").style.height = window_height * 0.5 + "px";
// document.querySelector(".timeline-wrapper__content__box").style.height = window_height * 0.52 + "px";
let route_id;
let stop_list = [];

$('#typeahead_route').bind('typeahead:select', function (ev, suggestion) {
    // let type = document.getElementById("suggestion_" + suggestion).dataset.type;
    document.getElementById('typeahead_route').blur();
    route_id = suggestion;
    document.getElementById("direction_switch").checked = false;
    get_bus_stop_list(route_id, "in");
    // document.getElementById("").innerText = suggestion;
    window.setTimeout(detail2, 800);
});

export const get_bus_stop_list = (route_id, direction) => {
    fetch('bus_stop_list_by_route?route_id=' + route_id + "&direction=" + direction + "&t=", {method: 'get'})
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json()
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        })
        .then(function (data) {
            return display_stops(data['stops_list'], route_id);
        }).then(function (stops) {
        stop_list = [];
        for (let i = 0; i < stops.length; i++) {
            stop_list.push(parseInt(stops[i][0]));
            update_real_time(i, stops[i][0], route_id);
        }
    }).catch(function (error) {
        return error;
    })
};

const timeline__content = document.getElementById("timeline__content");
const display_stops = (stops, route_id) => {
    for (let i of document.querySelectorAll("li")) {
        i.remove();
    }

    for (let value of stops) {
        let li = document.createElement("li");
        let h3 = document.createElement("h3");
        h3.innerHTML = "<h6 class='stop_id'>" + value[0] + "<span class='stop_id__span'>" + value[2] + " min</span></h6>" + value[1];
        h3.className = "timeline-wrapper__content__h3";
        li.append(h3);
        li.className = "timeline-wrapper__content__event";
        li.id = "timeline-wrapper__content-li";
        timeline__content.appendChild(li);
    }
    let split_index = stops[0][3].indexOf("-");
    document.getElementById("routes__content__card__direction").innerText = "Towards" + stops[0][3].substring(split_index + 1);
    document.getElementById("routes__content__card__route-id").innerText = route_id;
    if (is_favourite(route_id)) {
        route_heart_empty.style.display = 'none';
        route_heart_solid.style.display = '';
    } else {
        route_heart_empty.style.display = '';
        route_heart_solid.style.display = 'none';
    }
    return stops;
};


const direction_switch = document.getElementById("direction_switch");
direction_switch.addEventListener("change", () => {
    if (direction_switch.checked === true) {
        get_bus_stop_list(route_id, "out");
    } else {
        get_bus_stop_list(route_id, "in");
    }
});

const update_real_time = (num, stop_id, route_id) => {
    fetch('real_time_for_route?stop_id=' + stop_id + '&route_id=' + route_id, {method: 'get'})
        .then(function (data) {
            return data.json();

        }).then(function (data) {
        let elem = document.querySelectorAll("li")[num];
        if (data['time'] === 'Due') {
            display_bus_arrival_time(num);
            elem.getElementsByTagName('span')[0].innerHTML = '<ion-icon class="bus-icon" name="md-bus" size="large"></ion-icon>';
        } else {
            elem.getElementsByTagName('span')[0].innerHTML = data['time'] + 'mins    ';
        }
    })
        .catch(function (error) {
            console.log(error)
        });
};


const display_bus_arrival_time = (num) => {
    let elem = document.querySelectorAll("li")[num];
    elem.getElementsByTagName('span')[0].style.display = 'inline';
    elem.classList.remove('timeline-wrapper__content__event');
    elem.classList.add('timeline-wrapper__content__event__fill');
};


export const detail2 = () => {
    const container = $("#routes-container");
    if (container.css('margin-left') === '0px') {
        container.animate({'margin-left': '-100%'}, 200, 'linear');
    } else {
        container.animate({'margin-left': '0'}, 200, 'linear');
    }
};

document.getElementById("routes__toolbar__back-btn").addEventListener('click', () => {
    detail2();
    update_favourites_routes();
});
const cards = document.getElementsByClassName("routes__content__card");
for (let card of cards) {
    card.addEventListener('click', function () {
        route_id = this.dataset.id;
        get_bus_stop_list(this.dataset.id, this.dataset.direction);
        window.setTimeout(detail2, 800);
    });
}
const clear_markers = () => {
    for (let [key, value] of Object.entries(markers)) {
        value.setMap(null);
    }
    // for (let stop_ID of stop_list) {
    //     markers["" + stop_ID].setMap(map);
    // }
};

const snap_to_road = () => {
    fetch('/snap_to_road', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"stop_list": stop_list})
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
    });
};


const route_show_on_map = () => {
    const draw_height = $(".drawer__container").css('height');
    if (draw_height === "290px") {
        document.getElementById("routes__show-on-map-btn__name").innerText = "";
        $("#routes__show-on-map-btn__name").append("<ion-icon name='md-map'></ion-icon>Show on map");
        document.getElementById("routes__toolbar__back-btn").style.display = '';
        $('.drawer__container').animate({'height': window.innerHeight * 0.95}, 200, 'linear');
    } else {
        // snap_to_road();
        clear_markers();
        let mid_stop = stop_list[Math.floor(stop_list.length / 2)];
        map.setZoom(12);
        let mid_marker = markers["" + mid_stop].getPosition();
        map.setCenter({lat: mid_marker.lat(), lng: mid_marker.lng()});
        document.getElementById("routes__show-on-map-btn__name").innerText = "";
        document.getElementById("routes__toolbar__back-btn").style.display = 'none';
        $("#routes__show-on-map-btn__name").append("<ion-icon name='md-arrow-dropup' size=\"medium\"></ion-icon> More result");
        $('.drawer__container').animate({'height': 290}, 200, 'linear');
    }
};

document.getElementById("routes__show-on-map-btn").addEventListener('click', route_show_on_map);

document.getElementById('typeahead_route').addEventListener('click', function () {
    $(window).scrollTop(110);
});

$(".timeline-wrapper__content__box").on("touchmove", function (e) {
    e.stopPropagation();
});
$(".routes__content__wrapper").on("touchmove", function (e) {
    e.stopPropagation();
});


const route_heart_solid = document.getElementById("routes__content__card__heart-solid");
const route_heart_empty = document.getElementById("routes__content__card__heart-empty");

route_heart_solid.addEventListener('click', () => {
    let route_id = document.getElementById("routes__content__card__route-id").innerText;
    route_confirm_box(route_id);
});

route_heart_empty.addEventListener('click', () => {
    let route_id = document.getElementById("routes__content__card__route-id").innerText;
    route_save_favourites(route_id);
    route_toggle_heart();
});


export function route_confirm_box(route_id) {
    controller.create({
        header: 'CONFIRM!',
        message: 'Do you want to <strong>remove</strong> this route?',
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
            }, {
                text: 'Okay',
                handler: () => {
                    route_remove_favourites(route_id);
                    route_toggle_heart();
                    update_hide_card(route_id);
                }
            }
        ]
    }).then(alert => {
        alert.present();
    });
}


const is_favourite = (route_id) => {
    route_id = String(route_id);
    let route_arr = JSON.parse(localStorage.getItem("routes"));
    if (!route_arr || route_arr.length === 0) {
        return false;
    }
    for (let i = 0; i < route_arr.length; i++) {
        if (route_arr[i] === route_id) {
            return true;
        }
    }
    return false;
};

export const route_toggle_heart = () => {
    if (route_heart_solid.style.display === '') {
        route_heart_empty.style.display = '';
        route_heart_solid.style.display = 'none';
    } else {
        route_heart_empty.style.display = 'none';
        route_heart_solid.style.display = '';
    }
};

export const route_save_favourites = (route_id) => {
    let route_arr = JSON.parse(localStorage.getItem("routes"));
    if (!route_arr) {
        route_arr = [];
    }
    route_arr.push(route_id);
    route_arr = new Set(route_arr);
    localStorage.setItem("routes", JSON.stringify(route_arr));
};

export const route_remove_favourites = (route_id) => {
    let route_arr = JSON.parse(localStorage.getItem("routes"));
    let temp = [];
    for (let i = 0; i < route_arr.length; i++) {
        if (route_arr[i] !== route_id) {
            temp.push(route_arr[i]);
        }
    }
    localStorage.setItem("routes", JSON.stringify(temp));
};

document.getElementById("tab-button-routes").addEventListener('click', () => {
    update_favourites_routes();
});

const update_favourites_routes = () => {
    let route_arr = JSON.parse(localStorage.getItem("routes"));
    let elem = document.getElementById("favourite_routes__cards__in__route");
    if (elem) {
        elem.remove();
        $('#routes__content__wrapper').append('<div id="favourite_routes__cards__in__route"></div>');
    }
    if (route_arr && route_arr.length !== 0) {
        for (let id of route_arr) {
            create_favourite_route_card(id, "route");
        }
    }
};

const update_hide_card = (route_id) => {
    let cards = document.querySelectorAll("#routes__content__card__" + route_id);
    for (let card of cards) {
        card.style.display = 'none';
    }
};