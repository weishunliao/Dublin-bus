import {
    confirm_box,
    detail,
    get_bus_real_time_info,
    save_favourites,
    toggle_heart,
    set_height,
} from "./stops";
import {markerListener, initialLocation, directionsService, FindMyRoutes} from "./google_maps";
import {
    detail2,
    get_bus_stop_list,
    route_confirm_box,
    route_save_favourites,
    route_toggle_heart
} from "./routes";
import {toInput, fromInput, setTimeToNow, fromContainer, toContainer} from "./nodes";
import {bottomSwiper} from "./touches";


let favHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
);

let favTabs = document.querySelector('.tabbar-container').getBoundingClientRect().height;
document.querySelector(".favourite-journeys-container").style.height = (favHeight - favTabs - (favHeight * 0.05) - 210) + "px";
document.querySelector("#favourite_stops__content__wrapper").style.height = (favHeight - favTabs - (favHeight * 0.1) - 210) + "px";
document.querySelector("#favourite_routes__content__wrapper").style.height = (favHeight - favTabs - (favHeight * 0.07) - 210) + "px";


const get_stop_name = stop_id => {
    return new Promise((resolve, reject) => {
        fetch("/static/cache/stops.json")
            .then(response => {
                return response.json();
            })
            .then(data => {
                resolve(data["" + stop_id][2]);
            })
            .catch(err => {
                reject(err);
            });
    });
};

const get_serve_route = stop_id => {
    return new Promise((resolve, reject) => {
        fetch("/static/cache/bus_serve_route.json")
            .then(response => {
                return response.json();
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
            });
    });
};

const get_headsign = route_id => {
    return new Promise((resolve, reject) => {
        fetch("/static/cache/headsigh.json")
            .then(response => {
                return response.json();
            })
            .then(data => {
                resolve(data[route_id]);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const create_favourite_stop_card = (stop_id, tab_name) => {
    set_height();
    get_stop_name(stop_id).then(stop_name => {
        get_serve_route(stop_id).then(serve_route => {
            let card =
                '<ion-card class="stops__content__card card_pointer" id="stops__content__card__' +
                stop_id +
                '" data-item=' +
                stop_id +
                ">\n" +
                "                    <ion-grid no-padding>\n" +
                "                        <ion-row>\n" +
                '                            <ion-col size="9">\n' +
                '                                <div class="stops__content__card__stop-name">\n' +
                "                                    <span>" +
                stop_name +
                "</span>\n" +
                "                                </div>\n" +
                "                            </ion-col>\n" +
                '                            <ion-col align-self-end size="3">\n' +
                '                                <div class="stops__content__card__heart">\n' +
                '                                    <ion-icon name="heart" id="card__heart-solid__in__' +
                tab_name +
                "_" +
                stop_id +
                '" style=""></ion-icon>\n' +
                '                                    <ion-icon name="heart-outline" id="card__heart-empty__in__' +
                tab_name +
                "_" +
                stop_id +
                '" style="display: none"></ion-icon>\n' +
                "                                </div>\n" +
                "                            </ion-col>\n" +
                "                        </ion-row>\n" +
                '                        <ion-row id="card_bottom_' +
                tab_name +
                "_" +
                stop_id +
                '">\n' +
                '                            <ion-col size="4" align-self-baseline>\n' +
                '                                <ion-item lines="none" class="stops__content__card__stop-id">\n' +
                "                                    <span>" +
                stop_id +
                "</span>\n" +
                "                                </ion-item>\n" +
                "                            </ion-col>\n" +
                '                            <ion-col size="8">\n' +
                '                                <ion-item lines="none">\n' +
                '                                    <ion-icon name="bus"\n' +
                '                                              class="stops__content__card__service-bus"></ion-icon>\n' +
                '                                    <span class="stops__content__card__service-bus-id">' +
                serve_route +
                "</span>\n" +
                "                                </ion-item>\n" +
                "                            </ion-col>\n" +
                "                        </ion-row>\n" +
                "                    </ion-grid>\n" +
                "                </ion-card>";

            $("#favourite_stops__cards__in__" + tab_name).append(card);
            if (tab_name === "stop") {
                const elem = document.getElementById(
                    "stops__content__card__" + stop_id
                );
                elem.addEventListener("click", () => {
                    get_bus_real_time_info(elem.dataset.item);
                    detail();
                });
            } else {
                document
                    .getElementById("card__heart-solid__in__" + tab_name + "_" + stop_id)
                    .addEventListener("click", () => {
                        confirm_box(stop_id);
                    });
                document
                    .getElementById("card__heart-empty__in__" + tab_name + "_" + stop_id)
                    .addEventListener("click", () => {
                        save_favourites(stop_id);
                        toggle_heart();
                    });
                const elem = document.getElementById(
                    "card_bottom_" + tab_name + "_" + stop_id
                ).parentElement.parentElement;
                elem.addEventListener("click", (e) => {
                    if (e.target.name !== 'heart') {
                        markerListener(stop_id);
                    }
                });
            }
        });
    });
};
export const create_favourite_route_card = (route_id, tab_name) => {
    set_height();

    get_headsign(route_id).then(direction => {
        let card =
            '<ion-card class="routes__content__card card_pointer" id="routes__content__card__' +
            route_id + "_in_" + tab_name +
            '" data-direction="in"\n' +
            '                                      data-id="' +
            route_id +
            '">\n' +
            "                                <ion-grid no-padding>\n" +
            "                                    <ion-row>\n" +
            '                                        <ion-col size="9">\n' +
            '                                            <div class="routes__content__card__direction">\n' +
            "                                                <span>" +
            direction +
            "</span>\n" +
            "                                            </div>\n" +
            "                                        </ion-col>\n" +
            '                                        <ion-col align-self-end size="3">\n' +
            '                                            <div class="routes__content__card__heart">\n' +
            '                                                <ion-icon name="heart" id="route__card__heart-solid__in__' +
            tab_name +
            "_" +
            route_id +
            '" style=""></ion-icon>\n' +
            '                                                <ion-icon name="heart-outline" id="route__card__heart-empty__in__' +
            tab_name +
            "_" +
            route_id +
            '" style="display: none"></ion-icon>\n' +
            "                                            </div>\n" +
            "                                        </ion-col>\n" +
            "                                    </ion-row>\n" +
            "                                    <ion-row>\n" +
            '                                        <ion-col size="12" align-self-baseline>\n' +
            '                                            <ion-item lines="none" class="routes__content__card__route-id">\n' +
            "                                                <span>" +
            route_id +
            "</span>\n" +
            "                                            </ion-item>\n" +
            "                                        </ion-col>\n" +
            "                                    </ion-row>\n" +
            "                                </ion-grid>\n" +
            "                            </ion-card>\n";

        $("#favourite_routes__cards__in__" + tab_name).append(card);
        if (tab_name === "route") {
            const elem = document.getElementById(
                "routes__content__card__" + route_id + "_in_" + tab_name
            );
            elem.addEventListener("click", () => {
                get_bus_stop_list(route_id, "in");
                detail2();
            });
        } else {
            document
                .getElementById(
                    "route__card__heart-solid__in__" + tab_name + "_" + route_id
                )
                .addEventListener("click", () => {
                    route_confirm_box(route_id);
                });
            document
                .getElementById(
                    "route__card__heart-empty__in__" + tab_name + "_" + route_id
                )
                .addEventListener("click", () => {
                    route_save_favourites(route_id);
                    route_toggle_heart();
                });
            document.querySelector("#routes__content__card__" + route_id + "_in_" + tab_name).addEventListener('click', (e) => {
                if (e.target.name !== 'heart') {
                    switch_to_route_tab(route_id);
                }
            });
        }
    });
};
document
    .getElementById("tab-button-favourites")
    .addEventListener("click", () => {
        update_stop_list();
        update_route_list();
        update_journey_list();
    });

export const update_stop_list = () => {
    let stop_arr = JSON.parse(localStorage.getItem("stops"));
    let elem = document.getElementById("favourite_stops__cards__in__favo");
    if (elem) {
        elem.remove();
        $("#favourite_stops__content__wrapper").append(
            '<div id="favourite_stops__cards__in__favo"></div>'
        );
    }
    if (stop_arr && stop_arr.length !== 0) {
        for (let id of stop_arr) {
            create_favourite_stop_card(id, "favo");
        }
    } else {
        $("#favourite_stops__cards__in__favo").append(empty_msg('stop'));
    }
};
export const update_route_list = () => {
    let route_arr = JSON.parse(localStorage.getItem("routes"));
    let elem = document.getElementById("favourite_routes__cards__in__favo");
    if (elem) {
        elem.remove();
        $("#favourite_routes__content__wrapper").append(
            '<div id="favourite_routes__cards__in__favo"></div>'
        );
    }
    if (route_arr && route_arr.length !== 0) {
        for (let id of route_arr) {
            create_favourite_route_card(id, "favo");
        }
    } else {
        $("#favourite_routes__cards__in__favo").append(empty_msg('route'));
    }
};

let journeyList = JSON.parse(localStorage.getItem("journeys"));

let savedJourneysContainer = document.querySelector(
    ".favourite-journeys-container"
);


async function removeFavourite(id) {
    currentJourneysInStorage = JSON.parse(localStorage.getItem("journeys"));
    const alertController = document.querySelector('ion-alert-controller');
    await alertController.componentOnReady();
    const alert = await alertController.create({
        header: 'Delete journey?',
        message: 'Are you sure you want to delete this journey from your favourites?',
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
            },
            {
                text: 'OK',
                role: 'confirm',
                handler: () => {
                    delete currentJourneysInStorage[id]
                    localStorage.setItem("journeys", JSON.stringify(currentJourneysInStorage));
                    update_journey_list();
                }
            }

        ]
    }).then(alert => alert.present());

}

const update_journey_list = () => {
    journeyList = JSON.parse(localStorage.getItem("journeys"));

    if (journeyList && Object.keys(journeyList).length !== 0) {
        savedJourneysContainer.innerHTML = "";
        let journeys = Object.keys(journeyList);
        journeys.forEach(journey => {
            savedJourneysContainer.innerHTML += journeyList[journey].nodeHTML;
        });
        let cards = document.querySelectorAll(".journey__content__card");
        for (let card of cards) {
            card.addEventListener('click', (e) => {
                if (e.target.name !== 'heart') {
                    setTimeToNow();
                    fromInput.value = card.dataset.from;
                    toInput.value = card.dataset.to;
                    document.querySelector("ion-tabs").select("journey");
                    fromContainer.classList.add('focussed');
                    toContainer.classList.add('focussed');
                    FindMyRoutes(initialLocation, directionsService);
                }
            })
        }
        const heart_icons = document.querySelectorAll('.journey__content__card__icon2');
        for (let heartIcon of heart_icons) {
            let id = heartIcon.children[0].id;
            heartIcon.addEventListener('click', () => {
                removeFavourite(id);
            });
        }
    } else {
        savedJourneysContainer.innerHTML = empty_msg('journey');
    }
};

window.onload = function () {
    const mySwiper = new Swiper(".swiper-container", {
        // loop: true,
        observer: true,
        observeParents: true
    });
    const stop_col = document.querySelector(".favourites__head__subtitle__col1");
    const route_col = document.querySelector(".favourites__head__subtitle__col2");
    const journey_col = document.querySelector(
        ".favourites__head__subtitle__col3"
    );
    const cols = [stop_col, route_col, journey_col];

    for (let i = 0; i < cols.length; i++) {
        cols[i].addEventListener("click", () => {
            mySwiper.slideToLoop(i, 300, true);
        });
    }
    mySwiper.on("slideChange", function () {
        for (let i = 0; i < cols.length; i++) {
            if (mySwiper.realIndex === i) {
                cols[i].style.borderBottomColor = "#3D5F7E";
            } else {
                cols[i].style.borderBottomColor = "transparent";
            }
        }
    });
};

const saveJourneyButton = document.querySelector("#save-journey");


class SavedJourney {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.nodeHTML = `<ion-card class="journey__content__card card_pointer" data-from = "${from}" data-to="${to}">
        <ion-grid no-padding>
            <ion-row class="journey__content__card__row">
                <ion-col size="2" class="journey__content__card__icon1" align-self-center>
                    <div><i class="fas fa-circle"></i></div>
                </ion-col>
                <ion-col size="8" class="journey__content__card__start" id="journey__content__card__address" align-self-center>
                    <span>${from}</span>
                </ion-col>
                <ion-col size="2" class="journey__content__card__icon2" align-self-center>
                    <ion-icon name="heart" id="${from + to}"></ion-icon>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="2" class="ion-no-padding" id="journey__content__card__address">
                    <div class="journey__content__card__to">.<br>.<br>.<br>.<br>.<br>.<br>.<br>
                    </div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="2" align-self-center>
                    <div class="journey__content__card__icon3"><i
                            class="fas fa-map-marker-alt"></i></div>
                </ion-col>
                <ion-col size="9" class="journey__content__card__end" id="journey__content__card__address">
                    <span>${to}</span>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-card>`;
    }
}

// let savedJourneys = JSON.parse(localStorage.getItem("journeys"));
// if (!savedJourneys) {
//   savedJourneys = {};
// }

let currentJourneysInStorage;

saveJourneyButton.addEventListener("click", () => {


    currentJourneysInStorage = JSON.parse(localStorage.getItem("journeys"));
    let checkForKey = fromInput.value + toInput.value;

    if (!currentJourneysInStorage) {
        currentJourneysInStorage = {};
    }

    if (checkForKey in currentJourneysInStorage) {
        delete currentJourneysInStorage[checkForKey]
        saveJourneyButton.children[0].setAttribute("name", "heart-outline");
        localStorage.setItem("journeys", JSON.stringify(currentJourneysInStorage));
        // presentToast('remove');
    } else {
        let currentJourney = new SavedJourney(fromInput.value, toInput.value);
        let journeyKey = fromInput.value + toInput.value;
        currentJourneysInStorage[journeyKey] = currentJourney;
        saveJourneyButton.children[0].setAttribute("name", "heart");
        localStorage.setItem("journeys", JSON.stringify(currentJourneysInStorage));
        // presentToast('add');
    }


});


async function presentToast(addOrRemove) {
    bottomSwiper.changeState(bottomSwiper.MID_STATE);
    const toastController = document.querySelector("ion-toast-controller");
    await toastController.componentOnReady();
    let message;
    addOrRemove == 'add' ? message = 'Adding to favourites!' : message = 'Removing from favourites :(';

    const toast = await toastController.create({
        color: "primary",
        position: "top",
        message: message,
        duration: 1000,
        cssClass: "toast-test"
    });
    setTimeout(() => {
        bottomSwiper.changeState(bottomSwiper.OUT_STATE);
    }, 1500)
    return await toast.present();

}


export function checkFavouriteJourneys() {
    currentJourneysInStorage = JSON.parse(localStorage.getItem("journeys"));

    if (!currentJourneysInStorage) {
        currentJourneysInStorage = {}
    }


    let journeyKeys = Object.keys(currentJourneysInStorage)

    if (journeyKeys.length == 0) {
        saveJourneyButton.children[0].setAttribute("name", "heart-outline");
    }

    for (let key of journeyKeys) {
        if (currentJourneysInStorage[key].from == fromInput.value && currentJourneysInStorage[key].to == toInput.value) {

            saveJourneyButton.children[0].setAttribute("name", "heart");
            return;
        } else {

            saveJourneyButton.children[0].setAttribute("name", "heart-outline");
        }
    }

}


export const empty_msg = (tab) => {
    return '<ion-grid class="empty_favourite_wrapper">\n' +
        '                    <ion-row>\n' +
        '                    <ion-col size="5" class="empty_favourite_div">\n' +
        '                    <ion-icon name="heart-outline" class="empty_favourite_icon"></ion-icon>\n' +
        '                    </ion-col>    \n' +
        '                    </ion-row>\n' +
        '                    <ion-row><ion-col size="12" class="empty_favourite_title">\n' +
        '                    <span>You haven\'t added any ' + tab + 's yet...</span>\n' +
        '                    </ion-col>\n' +
        '                    </ion-row>\n' +
        '                    <ion-row>\n' +
        '                    <ion-col size="10" class="empty_favourite_subtitle">\n' +
        '                    <span>Favourite a station by tapping the heart on top right corner of ' + tab + ' page.</span>\n' +
        '                    </ion-col>\n' +
        '                    </ion-row>\n' +
        '                    </ion-grid>'
};


export const switch_to_route_tab = (route_id) => {
    document.querySelector("ion-tabs").getSelected().then(function (current_tab) {
        if (current_tab === "routes") {
            document
                .querySelector("ion-tabs")
                .select("none")
                .then(() => {
                    document.querySelector("ion-tabs").select("routes");
                });
        } else {
            document.querySelector("ion-tabs").select("routes");
        }
        const routes_container_position = $("#routes-container").css("margin-left");
        if (routes_container_position === "0px") {
            detail2();
        }
        get_bus_stop_list(route_id, "in");
        change_btn2();
    });
};


const change_btn2 = () => {
    document.getElementById("routes__toolbar__back-btn").innerText = "";
    document.getElementById("routes__show-on-map-btn__name").style.display =
        "none";
    $("#routes__toolbar__back-btn").append(
        "<ion-icon name='close' size='medium'></ion-icon>"
    );
    document
        .getElementById("routes__toolbar__back-btn")
        .removeEventListener("click", detail2);
    document
        .getElementById("routes__toolbar__back-btn")
        .addEventListener("click", close_btn2);
};

const close_btn2 = () => {
    bottomSwiper.changeState(bottomSwiper.IN_STATE, null);
    document.getElementById("routes__toolbar__back-btn").innerText = "";
    $("#routes__toolbar__back-btn").append(
        "<ion-icon name='arrow-back'></ion-icon>Back"
    );
    document.getElementById("routes__show-on-map-btn__name").style.display = "";
    document
        .getElementById("routes__toolbar__back-btn")
        .removeEventListener("click", close_btn2);
    document
        .getElementById("routes__toolbar__back-btn")
        .addEventListener("click", detail2);
};