import {map, markers} from "./google_maps";
import {create_favourite_stop_card, empty_msg, update_stop_list} from "./favourites";
import {height } from './nodes'

import {toast_route_add, toast_route_remove} from "./routes";
import {bottomSwiper, ourTabsHeight, swiperHeight} from "./touches";


export const set_height = () => {
    let h;

    if (is_mobile_JS){
        h = swiperHeight
    } else {
        h = height;
    }

    
    document.querySelector("#stops__content__wrapper").style.height = (h - ourTabsHeight - (h * 0.1) - 175) + "px";
    document.querySelector('.journey-planner__routes__scroll-area').style.height = (h - ourTabsHeight - 200) + "px";
    document.querySelector("#stops__time-table").style.height = (h - ourTabsHeight - 145) + "px";
    document.querySelector("#routes__content__wrapper").style.height = (h - ourTabsHeight - (h * 0.1) - 175) + "px";
    document.querySelector("#timeline-wrapper__content__box").style.height = (h - (2 * ourTabsHeight) - 145) + "px";
};

$('#typeahead_stop').bind('typeahead:select', function (ev, suggestion) {

    document.getElementById('typeahead_stop').blur();
    get_bus_real_time_info(suggestion);
    detail();
});


export const get_bus_real_time_info = (stop_id) => {
    document.getElementById('stops__show-on-map-btn').dataset.id = stop_id;
    document.getElementById("slots").innerHTML = `
                    <div class="loader__wrapper" id="bus_loader">
                        <h3>Please wait...</h3><br>
                        <div>
                            <img src="/static/images/bus.png" alt="" class="loader__bus">
                        </div>
                        <div class="loader__wrapper2">
                            <img src="/static/images/road.png" alt="" class="loader__road"/>
                        </div>
                    </div>
    `;
    fetch('real_time_info_for_bus_stop?stop_id=' + stop_id, {method: 'get'})
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.getElementById("stops__content__card__stop-id").innerText = stop_id;
            document.getElementById("stops__content__card__stop-name").innerText = data['stop_name'];
            if (is_favourite(stop_id)) {
                heart_empty.style.display = 'none';
                heart_solid.style.display = '';
            } else {
                heart_empty.style.display = '';
                heart_solid.style.display = 'none';
            }
            get_stop_server_route(stop_id);
            // create_chip(data[stop_id]);
            if (document.getElementById('slots') !== null) {
                document.getElementById('slots').remove();
                $('#stops__time-table-list').append('<div id="slots"></div>');
            } else {
                $('#stops__time-table-list').append('<div id="slots"></div>');
            }
            // Real Time Information is currently unavailable for this bus stop

            if (data[stop_id].length === 0) {
                let elem = '<ion-row class="stops__time-table-list__content">' +
                    '<ion-col size="10" offset="1"><div class="stops__time-table-list__content__error"><ion-label ' +
                    'class="stops__time-table-list__content__label__des stops__time-table-list__content__label">' +
                    'Real Time Information is currently unavailable for this bus stop</ion-label>' +
                    '</div></ion-col></ion-row>';
                $('#slots').append(elem);
            } else {
                for (let i = 0; i < data[stop_id].length; i++) {
                    let slot = data[stop_id][i];
                    create_card(slot[0], slot[1], slot[2]);
                }
            }
        }).catch(function (error) {
        return error;
    })
};


const create_card = (route_id, direction, remain) => {
    if (remain !== 'Due') {
        remain += '<br>mins';
    }

    let slot = '<ion-row class="stops__time-table-list__content">' +
        '<ion-col size="3"><ion-item lines="none"><ion-label ' +
        'class="stops__time-table-list__content__label__bus stops__time-table-list__content__label">' + route_id + '</ion-label>' +
        '</ion-item></ion-col><ion-col size="6"><ion-item lines="none"><ion-label ' +
        'class="stops__time-table-list__content__label__des stops__time-table-list__content__label" text-wrap> Toward ' + direction + '</ion-label>' +
        '</ion-item></ion-col><ion-col size="3"><ion-item lines="none"><ion-label ' +
        'class="stops__time-table-list__content__label__time stops__time-table-list__content__label">' + remain + '</ion-label>' +
        '</ion-item></ion-col></ion-row>';
    $('#slots').append(slot);
};

const create_chip = (data) => {
    let old_chips = document.getElementsByTagName('ion-chip');
    if (old_chips !== null) {
        document.getElementById("stops_chips_row").remove();
        $("#stops_chips_grid").append('<ion-row id="stops_chips_row"></ion-row>');
    } else {
        $("#stops_chips_grid").append('<ion-row id="stops_chips_row"></ion-row>');
    }
    const routes = new Set();
    for (let elem of data) {
        routes.add(elem[0]);
    }
    for (let route of routes) {
        let chip = '<ion-chip color="primary"><ion-icon name="md-swap"></ion-icon><ion-label>' + route + '</ion-label></ion-chip>';
        $('#stops_chips_row').append(chip);
    }
};


export const detail = () => {
    const container = $("#stops-container");
    if (container.css('margin-left') === '0px') {
        container.animate({'margin-left': '-100%'}, 200, 'linear');
    } else {
        container.animate({'margin-left': '0'}, 200, 'linear');
    }
};

document.getElementById("stops__toolbar__back-btn").addEventListener('click', () => {
    detail();
    update_favourites_stops();
});


const get_stop_server_route = (stop_id) => {
    fetch('server_route?stop_id=' + stop_id, {method: 'get'})
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let server_routes = "";
            for (let route of data['server_route']) {
                server_routes += route + "  ";
            }
            let elem = document.getElementById("stops__content__card__service-bus-id");
            if (data['server_route'].length > 10) {
                elem.style.fontSize = '1.3rem';
            } else if (data['server_route'].length > 5) {
                elem.style.fontSize = '1.6rem';
            } else {
                elem.style.fontSize = '2rem';
            }
            elem.innerText = server_routes;
        }).catch(function (error) {
        return error;
    })
};

const change_marker_icon = (stop_marker) => {
    let busStopIcon = stop_marker.getIcon();
    if (busStopIcon.url === '/static/images/marker.png') {
        busStopIcon.url = '/static/images/marker_highlight.png';
    } else {
        busStopIcon.url = '/static/images/marker.png'
    }
    stop_marker.setIcon(busStopIcon);
};
const show_on_map_btn = document.getElementById("stops__show-on-map-btn");
const stops_show_on_map = () => {
    let stop_marker = markers["" + show_on_map_btn.dataset.id];
    if (bottomSwiper.currentState === 4) {
        change_marker_icon(stop_marker);
        bottomSwiper.changeState(bottomSwiper.OUT_STATE);
        document.getElementById("stops__show-on-map-btn__name").innerText = "";
        document.getElementById("routes__show-on-map-btn__name").innerText = "";
        $("#stops__show-on-map-btn__name").append("<ion-icon name='md-map'></ion-icon>Show on map");
        $("#routes__show-on-map-btn__name").append("<ion-icon name='md-map'></ion-icon>Show on map");
        document.getElementById("stops__toolbar__back-btn").style.display = '';
        document.getElementById("routes__toolbar__back-btn").style.display = '';
    } else {
        bottomSwiper.changeState(bottomSwiper.LOWERED_STATE);
        let stop_position = stop_marker.getPosition();
        map.setCenter({lat: stop_position.lat(), lng: stop_position.lng()});
        map.setZoom(19);
        change_marker_icon(stop_marker);
        if (is_mobile) {
            document.getElementById("stops__show-on-map-btn__name").innerText = "";
            document.getElementById("stops__toolbar__back-btn").style.display = 'none';
            $("#stops__show-on-map-btn__name").append("<ion-icon name='md-arrow-dropup' size=\"medium\"></ion-icon> More result");
        }
    }
};

export const drawer_default_height = () => {
    document.getElementById("stops__show-on-map-btn__name").innerText = "";
    document.getElementById("routes__show-on-map-btn__name").innerText = "";
    $("#stops__show-on-map-btn__name").append("<ion-icon name='md-map'></ion-icon>Show on map");
    $("#routes__show-on-map-btn__name").append("<ion-icon name='md-map'></ion-icon>Show on map");
    document.getElementById("stops__toolbar__back-btn").style.display = '';
    document.getElementById("routes__toolbar__back-btn").style.display = '';
    $('.drawer__container').animate({'height': window.innerHeight * 0.95}, 200, 'linear');
};


show_on_map_btn.addEventListener('click', stops_show_on_map);

document.getElementById('typeahead_stop').addEventListener('click', function () {
    $(window).scrollTop(110);
});

$(".stops__content__wrapper").on("touchmove", function (e) {
    e.stopPropagation();
});

$(".stops__time-table").on("touchmove", function (e) {
    e.stopPropagation();
});

const heart_solid = document.getElementById("stops__content__card__heart-solid");
const heart_empty = document.getElementById("stops__content__card__heart-empty");

heart_solid.addEventListener('click', () => {
    let stop_id = document.getElementById("stops__content__card__stop-id").innerText;
    confirm_box(stop_id);
});

heart_empty.addEventListener('click', () => {
    toast_route_add();
    let stop_id = document.getElementById("stops__content__card__stop-id").innerText;
    save_favourites(stop_id);
    toggle_heart();
});


export const controller_confirm = document.querySelector('ion-alert-controller');

export function confirm_box(stop_id) {
    controller_confirm.create({
        header: 'DELETE STOP?',
        message: 'Do you want to <strong>remove</strong> this stop from your favourite?',
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
            }, {
                text: 'Okay',
                handler: () => {
                    remove_favourites(stop_id);
                    toggle_heart();
                    // hide_card(stop_id);
                    toast_route_remove();
                    update_stop_list();
                }
            }
        ]
    }).then(alert => {
        alert.present();
    });
}


const is_favourite = (stop_id) => {
    stop_id = String(stop_id);
    let stop_arr = JSON.parse(localStorage.getItem("stops"));
    if (!stop_arr || stop_arr.length === 0) {
        return false;
    }
    for (let i = 0; i < stop_arr.length; i++) {
        if (stop_arr[i] === stop_id) {
            return true;
        }
    }
    return false;
};

export const toggle_heart = () => {
    if (heart_solid.style.display === '') {
        heart_empty.style.display = '';
        heart_solid.style.display = 'none';
    } else {
        heart_empty.style.display = 'none';
        heart_solid.style.display = '';
    }
};

export const save_favourites = (stop_id) => {
    let stop_arr = JSON.parse(localStorage.getItem("stops"));
    if (!stop_arr) {
        stop_arr = [];
    }
    stop_arr.push(stop_id);
    stop_arr = new Set(stop_arr);
    localStorage.setItem("stops", JSON.stringify(stop_arr));
};

export const remove_favourites = (stop_id) => {
    let stop_arr = JSON.parse(localStorage.getItem("stops"));
    let temp = [];
    for (let i = 0; i < stop_arr.length; i++) {
        if (stop_arr[i] !== stop_id) {
            temp.push(stop_arr[i]);
        }
    }
    localStorage.setItem("stops", JSON.stringify(temp));
};

document.getElementById("tab-button-stops").addEventListener('click', () => {
    update_favourites_stops();
});

const update_favourites_stops = () => {
    let stop_arr = JSON.parse(localStorage.getItem("stops"));
    let elem = document.getElementById("favourite_stops__cards__in__stop");
    if (document.querySelector('.stops__depart_label').style.display === 'none') {
        document.querySelector('.stops__depart_label').style.display = '';
    }
    if (elem) {
        elem.remove();
        $('#stops__content__wrapper').append('<div id="favourite_stops__cards__in__stop"></div>');
    }
    if (stop_arr && stop_arr.length !== 0) {
        for (let id of stop_arr) {
            create_favourite_stop_card(id, "stop");
        }
    } else {
        document.querySelector('.stops__depart_label').style.display = 'none';
        $("#favourite_stops__cards__in__stop").append(empty_msg('stop'));
    }
};

const hide_card = (stop_id) => {
    let cards = document.querySelectorAll("#stops__content__card__" + stop_id);
    for (let card of cards) {
        card.style.display = 'none';
    }
};

document.getElementById("realtime_stop_refresher").addEventListener('click', () => {
    let stop_id = document.getElementById("stops__content__card__stop-id").innerText;
    get_bus_real_time_info(stop_id);
});