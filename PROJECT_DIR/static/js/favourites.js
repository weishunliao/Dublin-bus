import {confirm_box, detail, get_bus_real_time_info, save_favourites, toggle_heart} from "./stops";
import {markerListener} from "./google_maps";
import {detail2, get_bus_stop_list, route_confirm_box, route_save_favourites, route_toggle_heart} from "./routes";

const get_stop_name = (stop_id) => {
    return new Promise((resolve, reject) => {
        fetch('/static/cache/stops.json')
            .then(response => {
                return response.json()
            })
            .then(data => {
                resolve(data["" + stop_id][2])
            })
            .catch(err => {
                reject(err);
            })
    });
};

const get_serve_route = (stop_id) => {
    return new Promise((resolve, reject) => {
        fetch('/static/cache/bus_serve_route.json')
            .then(response => {
                return response.json()
            })
            .then(data => {
                let list = data["" + stop_id];
                let set = new Set();
                for (let r of list) {
                    set.add(r[0]);
                }
                let route_list = "";
                for (let elem of set) {
                    route_list += elem + "  ";
                }
                //
                // if (set.length > 10) {
                //     elem.style.fontSize = '1.3rem';
                // } else if (set.length > 5) {
                //     elem.style.fontSize = '1.6rem';
                // } else {
                //     elem.style.fontSize = '2rem';
                // }
                resolve(route_list);
            })
            .catch(err => {
                reject(err);
            })
    });
};

const get_headsign = (route_id) => {
    return new Promise((resolve, reject) => {
        fetch('/static/cache/headsigh.json')
            .then(response => {
                return response.json();
            }).then(data => {
            resolve(data[route_id]);
        }).catch(err => {
            reject(err);
        })
    })
};

export const create_favourite_stop_card = (stop_id, tab_name) => {
    get_stop_name(stop_id).then((stop_name) => {
        get_serve_route(stop_id).then((serve_route) => {
            let card = '<ion-card class="stops__content__card" id="stops__content__card__' + stop_id + '" data-item=' + stop_id + '>\n' +
                '                    <ion-grid no-padding>\n' +
                '                        <ion-row>\n' +
                '                            <ion-col size="9">\n' +
                '                                <div class="stops__content__card__stop-name">\n' +
                '                                    <span>' + stop_name + '</span>\n' +
                '                                </div>\n' +
                '                            </ion-col>\n' +
                '                            <ion-col align-self-end size="3">\n' +
                '                                <div class="stops__content__card__heart">\n' +
                '                                    <ion-icon name="heart" id="card__heart-solid__in__' + tab_name + '_' + stop_id + '" style=""></ion-icon>\n' +
                '                                    <ion-icon name="heart-empty" id="card__heart-empty__in__' + tab_name + '_' + stop_id + '" style="display: none"></ion-icon>\n' +
                '                                </div>\n' +
                '                            </ion-col>\n' +
                '                        </ion-row>\n' +
                '                        <ion-row id="card_bottom_' + tab_name + "_" + stop_id + '">\n' +
                '                            <ion-col size="4" align-self-baseline>\n' +
                '                                <ion-item lines="none" class="stops__content__card__stop-id">\n' +
                '                                    <span>' + stop_id + '</span>\n' +
                '                                </ion-item>\n' +
                '                            </ion-col>\n' +
                '                            <ion-col size="8">\n' +
                '                                <ion-item lines="none">\n' +
                '                                    <ion-icon name="md-bus"\n' +
                '                                              class="stops__content__card__service-bus"></ion-icon>\n' +
                '                                    <span class="stops__content__card__service-bus-id">' + serve_route + '</span>\n' +
                '                                </ion-item>\n' +
                '                            </ion-col>\n' +
                '                        </ion-row>\n' +
                '                    </ion-grid>\n' +
                '                </ion-card>';

            $('#favourite_stops__cards__in__' + tab_name).append(card);
            if (tab_name === "stop") {
                const elem = document.getElementById("stops__content__card__" + stop_id);
                elem.addEventListener('click', () => {
                    get_bus_real_time_info(elem.dataset.item);
                    window.setTimeout(detail, 800);
                });
            } else {
                document.getElementById('card__heart-solid__in__' + tab_name + '_' + stop_id).addEventListener('click', () => {
                    confirm_box(stop_id);
                });
                document.getElementById('card__heart-empty__in__' + tab_name + '_' + stop_id).addEventListener('click', () => {
                    save_favourites(stop_id);
                    toggle_heart();
                });
                const elem = document.getElementById("card_bottom_" + tab_name + "_" + stop_id);
                elem.addEventListener('click', () => {
                    markerListener(stop_id);
                });
            }
        })
    });
};
export const create_favourite_route_card = (route_id, tab_name) => {
    get_headsign(route_id).then(direction => {
        let card = '<ion-card class="routes__content__card" id="routes__content__card__' + route_id + '" data-direction="in"\n' +
            '                                      data-id="' + route_id + '">\n' +
            '                                <ion-grid no-padding>\n' +
            '                                    <ion-row>\n' +
            '                                        <ion-col size="9">\n' +
            '                                            <div class="routes__content__card__direction">\n' +
            '                                                <span>' + direction + '</span>\n' +
            '                                            </div>\n' +
            '                                        </ion-col>\n' +
            '                                        <ion-col align-self-end size="3">\n' +
            '                                            <div class="routes__content__card__heart">\n' +
            '                                                <ion-icon name="heart" id="route__card__heart-solid__in__' + tab_name + '_' + route_id + '" style=""></ion-icon>\n' +
            '                                                <ion-icon name="heart-empty" id="route__card__heart-empty__in__' + tab_name + '_' + route_id + '" style="display: none"></ion-icon>\n' +
            '                                            </div>\n' +
            '                                        </ion-col>\n' +
            '                                    </ion-row>\n' +
            '                                    <ion-row>\n' +
            '                                        <ion-col size="12" align-self-baseline>\n' +
            '                                            <ion-item lines="none" class="routes__content__card__route-id">\n' +
            '                                                <span>' + route_id + '</span>\n' +
            '                                            </ion-item>\n' +
            '                                        </ion-col>\n' +
            '                                    </ion-row>\n' +
            '                                </ion-grid>\n' +
            '                            </ion-card>\n';

        $('#favourite_routes__cards__in__' + tab_name).append(card);
        if (tab_name === "route") {
            const elem = document.getElementById("routes__content__card__" + route_id);
            elem.addEventListener('click', () => {
                get_bus_stop_list(route_id, "in");
                window.setTimeout(detail2, 800);
            });
        } else {
            document.getElementById('route__card__heart-solid__in__' + tab_name + '_' + route_id).addEventListener('click', () => {
                route_confirm_box(route_id);
            });
            document.getElementById('route__card__heart-empty__in__' + tab_name + '_' + route_id).addEventListener('click', () => {
                route_save_favourites(route_id);
                route_toggle_heart();
            });
        }
    })
};
document.getElementById("tab-button-favourites").addEventListener('click', () => {
    update_stop_list();
    update_route_list()
});

const update_stop_list = () => {
    let stop_arr = JSON.parse(localStorage.getItem("stops"));
    let elem = document.getElementById("favourite_stops__cards__in__favo");
    if (elem) {
        elem.remove();
        $('#favourite_stops__content__wrapper').append('<div id="favourite_stops__cards__in__favo"></div>');
    }
    if (stop_arr && stop_arr.length !== 0) {
        for (let id of stop_arr) {
            create_favourite_stop_card(id, "favo");
        }
    }
};
const update_route_list = () => {
    let route_arr = JSON.parse(localStorage.getItem("routes"));
    let elem = document.getElementById("favourite_routes__cards__in__favo");
    if (elem) {
        elem.remove();
        $('#favourite_routes__content__wrapper').append('<div id="favourite_routes__cards__in__favo"></div>');
    }
    if (route_arr && route_arr.length !== 0) {
        for (let id of route_arr) {
            create_favourite_route_card(id, "favo");
        }
    }
};

window.onload = function () {
    const mySwiper = new Swiper('.swiper-container', {
        // loop: true,
        observer: true,
        observeParents: true,
    });
    const stop_col = document.querySelector(".favourites__head__subtitle__col1");
    const route_col = document.querySelector(".favourites__head__subtitle__col2");
    const journey_col = document.querySelector(".favourites__head__subtitle__col3");
    const cols = [stop_col, route_col, journey_col];

    for (let i = 0; i < cols.length; i++) {
        cols[i].addEventListener('click', () => {
            mySwiper.slideToLoop(i, 300, true);
        });
    }
    mySwiper.on('slideChange', function () {
        for (let i = 0; i < cols.length; i++) {
            if (mySwiper.realIndex === i) {
                cols[i].style.borderBottomColor = '#3D5F7E';
            } else {
                cols[i].style.borderBottomColor = 'transparent';
            }
        }
    });
};


