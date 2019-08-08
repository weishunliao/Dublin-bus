import {markers, map, bus_route_drawer} from "./google_maps";
import {create_favourite_route_card} from "./favourites";
import {controller_confirm} from "./stops";
import {controller} from "./nodes";
import {bottomSwiper} from "./touches";


let route_id;
export let stop_list = [];
let realtime_bus_marker = [];
let realtime_bus_marker_on_map = [];
let head_sign;

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
            let stops = data['stops_list'];
            stop_list = [];
            realtime_bus_marker = [];
            for (let i = 0; i < stops.length; i++) {
                stop_list.push(parseInt(stops[i][0]));
                update_real_time(i, stops[i][0], route_id);
            }
            document.getElementById("routes__content__card__route-id").innerText = route_id;
            setTimeout(() => {
                display_stops(stops, route_id);
            }, 5000);
            // display_stops(stops, route_id);
        }).then(function (stops) {

    }).catch(function (error) {
        return error;
    })
};


const display_stops = (stops, route_id) => {
    document.getElementById('timeline-wrapper__content__box').innerHTML = '<ul class="timeline-wrapper__content" id="timeline__content"></ul>';
    let timeline__content = document.getElementById("timeline__content");
    if (stops.length === 0) {
        document.getElementById('timeline-wrapper__content__box').innerHTML = "<h1 id='empty_stop_list'>This route is currently out of service.</h1>";
        document.getElementById("routes__content__card__direction").innerText = "Towards";
    } else {
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

const update_real_time = (num, stop_id, route_id) => {
    fetch('real_time_for_route?stop_id=' + stop_id + '&route_id=' + route_id, {method: 'get'})
        .then(function (data) {
            return data.json();

        }).then(function (data) {
        // let elem = document.querySelectorAll("li")[num];
        // if (data['time'] === 'Due') {
        //     display_bus_arrival_time(num);
        //     realtime_bus_marker.push(stop_id);
        //     elem.getElementsByTagName('span')[0].innerHTML = '<ion-icon class="bus-icon" name="md-bus" size="large"></ion-icon>';
        // } else {
        //     elem.getElementsByTagName('span')[0].innerHTML = data['time'] + 'mins    ';
        // }
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
    clearInterval(blinker);
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
    // setInterval(blinker, 800);
};
const blinker = () => {
    for (let busMarker of realtime_bus_marker_on_map) {
        if (busMarker.getMap() === null) {
            busMarker.setMap(map);
        } else {
            busMarker.setMap(null);
        }
    }
};

const route_show_on_map = () => {
    const draw_height = $(".drawer__container").css('height');
    if (bottomSwiper.currentState === 4) {
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
        document.getElementById("routes__show-on-map-btn__name").innerText = "";
        document.getElementById("routes__toolbar__back-btn").style.display = 'none';
        $("#routes__show-on-map-btn__name").append("<ion-icon name='arrow-dropup-circle' size='medium'></ion-icon> More result");
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
        message: 'Do you want to <strong>remove</strong> this route from your favourite?',
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
                    toast_route_remove();
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

export const toast_route_add = () => {
    controller.create({
        color: 'primary',
        duration: 1500,
        message: 'Adding to favourite!',
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
        message: 'Removed from favourite.',
        showCloseButton: true,
        position: 'top',
    }).then(toast => {
        toast.present();
    });
};