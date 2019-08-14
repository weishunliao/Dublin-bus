import {markers, map, bus_route_drawer, hideMarkers, showMarkers} from "./google_maps";
import {create_favourite_route_card, empty_msg, update_route_list} from "./favourites";
import {controller_confirm} from "./stops";
import {controller} from "./nodes";
import {bottomSwiper} from "./touches";


let route_id;
export let stop_list = [];
let realtime_bus_marker = [];
let realtime_bus_marker_on_map = [];
let head_sign;
let stops;

$('#typeahead_route').bind('typeahead:select', function (ev, suggestion) {
    // let type = document.getElementById("suggestion_" + suggestion).dataset.type;
    document.getElementById('typeahead_route').blur();
    route_id = suggestion;
    document.getElementById("direction_switch").checked = false;
    get_bus_stop_list(route_id, "in");
    // document.getElementById("").innerText = suggestion;
    detail2();
});
export const get_bus_stop_list = (id, direction) => {
    route_id = id;
    head_sign = direction;
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
            document.getElementById('timeline-wrapper__content__box').innerHTML =
                '<div class="loader__wrapper" id="bus_loader">\n' +
                '    <h3>Please wait...</h3><br>\n' +
                '    <div>\n' +
                '        <img src="/static/images/bus.png" alt="" class="loader__bus">\n' +
                '    </div>\n' +
                '    <div class="loader__wrapper2">\n' +
                '        <img src="/static/images/road.png" alt="" class="loader__road"/>\n' +
                '    </div>\n' +
                '</div>';
            stops = data['stops_list'];
            stop_list = [];
            realtime_bus_marker = [];
            for (let i = 0; i < stops.length; i++) {
                stop_list.push(parseInt(stops[i][0]));
            }
            document.getElementById("routes__content__card__route-id").innerText = route_id;
            update_real_time(stop_list, route_id).then((info) => {
                display_stops(route_id, info);
            });
        }).catch(function (error) {
        return error;
    })
};


const display_stops = (route_id, info) => {
    document.getElementById('timeline-wrapper__content__box').innerHTML = '<ul class="timeline-wrapper__content" id="timeline__content"></ul>';
    let timeline__content = document.getElementById("timeline__content");
    if (stops.length === 0) {
        document.getElementById('timeline-wrapper__content__box').innerHTML = "<h1 id='empty_stop_list'>This route is currently out of service.</h1>";
        document.getElementById("routes__content__card__direction").innerText = "Towards";
    } else {
        for (let i = 0; i < stops.length; i++) {
            let li = document.createElement("li");
            let h3 = document.createElement("h3");
            let id = parseInt(stops[i][0]);
            let prev_id = i === 0 ? "N/A" : parseInt(stops[i - 1][0]);
            let next_id = i === stops.length - 1 ? "N/A" : parseInt(stops[i + 1][0]);
            let arrive = info[id].length === 0 ? 'N/A' : info[id][0];
            let arrive_prev = prev_id === "N/A" || info[prev_id].length === 0 ? 'N/A' : info[prev_id][0];
            let arrive_next = next_id === "N/A" || info[next_id].length === 0 ? 'N/A' : info[next_id][0];
            if (arrive === 'Due' && arrive_prev !== 'Due') {
                realtime_bus_marker.push(id);
                h3.innerHTML = "<h6 class='stop_id'>" + id + "<ion-icon class=\"bus-icon\" name=\"md-bus\" size=\"large\"></ion-icon></h6>" + stops[i][1];
                li.className = "timeline-wrapper__content__event__fill";
            } else if (arrive !== 'N/A' && arrive_prev !== 'N/A' && parseInt(arrive) < parseInt(arrive_prev) && parseInt(arrive) <= parseInt(arrive_next)) {
                realtime_bus_marker.push(id);
                h3.innerHTML = "<h6 class='stop_id'>" + id + "<ion-icon class=\"bus-icon\" name=\"md-bus\" size=\"large\"></ion-icon></h6>" + stops[i][1];
                li.className = "timeline-wrapper__content__event__fill";
            } else {
                h3.innerHTML = "<h6 class='stop_id'>" + id + "<span class='stop_id__span'>" + arrive + " min</span></h6>" + stops[i][1];
                li.className = "timeline-wrapper__content__event";
            }
            h3.className = "timeline-wrapper__content__h3";
            li.append(h3);
            li.id = "timeline-wrapper__content-li";
            timeline__content.appendChild(li);
        }
        let split_index = stops[0][3].indexOf("-");
        document.getElementById("routes__content__card__direction").innerText = "Towards" + stops[0][3].substring(split_index + 1);
    }
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
direction_switch.addEventListener('click', () => {
    if (head_sign === 'in') {
        get_bus_stop_list(route_id, "out");
    } else {
        get_bus_stop_list(route_id, "in");
    }
});
document.getElementById("refresh_btn").addEventListener('click', () => {
    get_bus_stop_list(route_id, head_sign);
});

const update_real_time = (stop_list, route_id) => {
    return new Promise((resolve, reject) => {
        if (stop_list.length === 0) {
            resolve();
            return;
        }
        fetch('real_time_for_route', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"stop_list": stop_list, "route_id": route_id})
        }).then(function (data) {
            return data.json();
        }).then(function (data) {
            resolve(data);
        })
    }).catch(function (error) {
        console.log(error);
        reject();
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
        hideMarkers();
        container.animate({'margin-left': '-100%'}, 200, 'linear');
    } else {
        container.animate({'margin-left': '0'}, 200, 'linear');
    }
};

document.getElementById("routes__toolbar__back-btn").addEventListener('click', () => {
    clear_bus_marker_on_map();
    detail2();
    update_favourites_routes();
    bus_route_drawer.setMap(null);
});
const cards = document.getElementsByClassName("routes__content__card");
for (let card of cards) {
    card.addEventListener('click', function () {
        route_id = this.dataset.id;
        get_bus_stop_list(this.dataset.id, this.dataset.direction);
        detail2();
    });
}


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
        bus_route_drawer.setMap(map);
        bus_route_drawer.setPath(data['road']);
    });
};
const clear_bus_marker_on_map = () => {
    for (let bus of realtime_bus_marker_on_map) {
        bus.setMap(null);
        bus = null;
    }
    realtime_bus_marker_on_map = [];
};
const draw_bus_markers_on_route = () => {
    clear_bus_marker_on_map();
    for (let bus of realtime_bus_marker) {
        bus = parseInt(bus);
        let latitude = markers["" + bus].getPosition().lat();
        let longitude = markers["" + bus].getPosition().lng();
        let latLng = new google.maps.LatLng(latitude, longitude);
        let busStopIcon = {
            url: "/static/images/bus_realtime.svg", // url for the image
            scaledSize: new google.maps.Size(30, 30), // size of the image
            origin: new google.maps.Point(0, 0), // origin
        };
        let busMarker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: busStopIcon,
            title: route_id,
            id: route_id
        });
        realtime_bus_marker_on_map.push(busMarker);
        busMarker.setMap(map);
    }

};


const route_show_on_map = () => {
    hideMarkers();
    if (bottomSwiper.currentState === 4 || bus_route_drawer.getMap() !== null) {
        bottomSwiper.changeState(bottomSwiper.OUT_STATE);
        bus_route_drawer.setMap(null);
        clear_bus_marker_on_map();
        document.getElementById("routes__show-on-map-btn__name").innerText = "";
        $("#routes__show-on-map-btn__name").append("<ion-icon name='md-map'></ion-icon>Show on map");
        document.getElementById("routes__toolbar__back-btn").style.display = '';
    } else {
        bottomSwiper.changeState(bottomSwiper.LOWERED_STATE);
        snap_to_road();
        draw_bus_markers_on_route();
        let mid_stop = stop_list[Math.floor(stop_list.length / 2)];
        map.setZoom(12);
        let mid_marker = markers["" + mid_stop].getPosition();
        map.setCenter({lat: mid_marker.lat(), lng: mid_marker.lng()});
        if (is_mobile) {
            document.getElementById("routes__show-on-map-btn__name").innerText = "";
            document.getElementById("routes__toolbar__back-btn").style.display = 'none';
            $("#routes__show-on-map-btn__name").append("<ion-icon name='arrow-dropup-circle' size='medium'></ion-icon> More result");
        } else {
            document.getElementById("routes__show-on-map-btn__name").innerText = "";
            $("#routes__show-on-map-btn__name").append("<ion-icon name='md-close' size='medium'></ion-icon> Clear");
        }
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
    toast_route_add();
    let route_id = document.getElementById("routes__content__card__route-id").innerText;
    route_save_favourites(route_id);
    route_toggle_heart();
});


export function route_confirm_box(route_id) {
    controller_confirm.create({
        header: 'DELETE ROUTE?',
        message: 'Do you want to <strong>remove</strong> this route from your favourites?',
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
                    // update_hide_card(route_id);
                    toast_route_remove();
                    update_route_list();
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
    if (document.querySelector('.routes__favorite_label').style.display === 'none') {
        document.querySelector('.routes__favorite_label').style.display = '';
    }
    if (elem) {
        elem.remove();
        $('#routes__content__wrapper').append('<div id="favourite_routes__cards__in__route"></div>');
    }
    if (route_arr && route_arr.length !== 0) {
        for (let id of route_arr) {
            create_favourite_route_card(id, "route");
        }
    } else {
        document.querySelector('.routes__favorite_label').style.display = 'none';
        $("#favourite_routes__cards__in__route").append(empty_msg('route'));
    }
};

const update_hide_card = (route_id) => {
    let cards = document.querySelectorAll("#routes__content__card__" + route_id);
    for (let card of cards) {
        card.style.display = 'none';
    }
};

export const toast_route_add = () => {
    controller.create({
        color: 'primary',
        duration: 1000,
        message: 'Adding to favourites!',
        showCloseButton: true,
        position: 'top',
    }).then(toast => {
        toast.present();
    });
};

export const toast_route_remove = () => {
    controller.create({
        color: 'primary',
        duration: 1500,
        message: 'Removed from favourites.',
        showCloseButton: true,
        position: 'top',
    }).then(toast => {
        toast.present();
    });
};