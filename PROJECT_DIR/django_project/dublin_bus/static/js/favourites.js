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


const create_favourite_stop_card = (stop_id) => {
    get_stop_name(stop_id).then((stop_name) => {
        get_serve_route(stop_id).then((serve_route) => {
            let card = '<ion-card class="stops__content__card" id="stops__content__card" data-item="2">\n' +
                '                    <ion-grid no-padding>\n' +
                '                        <ion-row>\n' +
                '                            <ion-col size="9">\n' +
                '                                <div class="stops__content__card__stop-name">\n' +
                '                                    <span>' + stop_name + '</span>\n' +
                '                                </div>\n' +
                '                            </ion-col>\n' +
                '                            <ion-col align-self-end size="3">\n' +
                '                                <div class="stops__content__card__heart">\n' +
                '                                    <ion-icon name="heart" class="stops__content__card__heart"\n' +
                '                                              slot="end"></ion-icon>\n' +
                '                                </div>\n' +
                '                            </ion-col>\n' +
                '                        </ion-row>\n' +
                '                        <ion-row>\n' +
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
            $('#favourite_stops__content__cards').append(card);
        })
    });


};

document.getElementById("tab-button-favourites").addEventListener('click', () => {
    let stop_arr = JSON.parse(localStorage.getItem("stops"));
    let elem = document.getElementById("favourite_stops__content__cards");
    if (elem) {
        elem.remove();
        $('#favourite_stops__content__wrapper').append('<div id="favourite_stops__content__cards"></div>');
    }
    for (let id of stop_arr) {
        create_favourite_stop_card(id);
    }
});

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


