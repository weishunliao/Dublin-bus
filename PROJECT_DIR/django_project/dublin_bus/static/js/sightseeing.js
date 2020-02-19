import {fromInput, height, toInput, fromContainer, toContainer} from './nodes'
import {directionsService, FindMyRoutes, initialLocation} from "./google_maps";


let ourTabsHeight = document.querySelector('.tabbar-container').getBoundingClientRect().height;
document.querySelector(".sightseeing__options__cards").style.height = (height - ourTabsHeight - (height * 0.03) - 175) + "px";
let offset = 0;
const get_sights_info = (category) => {
    return new Promise((resolve, reject) => {
        fetch('sights_info?category=' + category + '&offset=' + offset, {method: 'get'})
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data['points'].length === 0) {
                    document.getElementById("more").remove();
                    return;
                } else {
                    offset += 10;
                    let points = data['points'];
                    for (let point of points) {
                        create_card(point);
                    }
                    if (document.getElementById("more")) {
                        document.getElementById("more").remove();
                    }
                    if (offset < 20) {
                        $('#sightseeing__options__wrapper').append(`<section style="width: 30%;margin: 0 auto" id="more">
                                        <ion-button expand="block" size="small">More</ion-button></section>`);
                    }
                }
                resolve();
            }).then(() => {
            if (offset < 20) {
                document.getElementById('more').addEventListener('click', () => {
                    const wrapper = $('#sightseeing__options__wrapper');
                    if (document.getElementById("more")) {
                        document.getElementById("more").remove();
                    }
                    wrapper.append(`<div id="more" class="more"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>`);
                    get_sights_info(category);
                })
            }
        }).catch(() => {
            reject();
        });
    });
};
const cards = document.getElementsByClassName("sightseeing__category__content__icon");

for (let card of cards) {

    card.addEventListener('click', function () {
        category_btn(this.id);
    });
}
const create_card = (point) => {
    let rating = Math.round(parseFloat(point[2]) / 5 * 100) + "%";
    let card = '<ion-card class="card_pointer" id="' + point[0] + '"><ion-grid><ion-row><ion-col align-self-center size="5" class="sightseeing__options__cards__photo" >' +
        '<img id="sightseeing__options__cards__photo" src="' + point[3] + '"/></ion-col><ion-col align-self-center size="7" ' +
        'class="sightseeing__options__cards__info"><ion-row><ion-col size="12" class="sightseeing__options__cards__info__name">' +
        '<span id="sightseeing__options__cards__info__name">' + point[0] + '</span></ion-col></ion-row><ion-row><ion-col size="12" ' +
        'class="sightseeing__options__cards__info__addr"><span id="sightseeing__options__cards__info__addr">' + point[1] + '</span>' +
        '</ion-col></ion-row><ion-row><ion-col size="2" class="sightseeing__options__cards__info__ratting__number"><span>' + point[2] + '</span></ion-col><ion-col size="10" class=""><div class="sightseeing__options__cards__info__ratting">\n' +
        '<div class="sightseeing__options__cards__info__ratting__top" id="sightseeing__options__cards__info__ratting" ' +
        'style="width: ' + rating + '"> \n' +
        ' <span>★★★★★</span></div><div class="sightseeing__options__cards__info__ratting__bottom"><span>★★★★★</span>' +
        '</div></div></ion-col></ion-row><ion-row><ion-col size="12" class="sightseeing__options__cards__info__opening-hour">' +
        '<ion-icon name="time" size="medium"></ion-icon><span id="sightseeing__options__cards__info__opening-hour">' + point[4] + '</span></ion-col></ion-row></ion-col></ion-row>' +
        '</ion-grid></ion-card>';

    $('#sightseeing__options__cards').append(card);
    document.getElementById(point[0]).addEventListener("click", () => {
        toInput.value = point[0] + " " + point[1];
        document.querySelector("ion-tabs").select("journey");
        fromContainer.classList.add('focussed')
        toContainer.classList.add('focussed')
        FindMyRoutes(initialLocation, directionsService);
    });
};

const page_switch = () => {
    if (document.getElementById("sightseeing__options__cards") !== null) {
        document.getElementById('sightseeing__options__cards').remove();
        $('.sightseeing__options__cards').append('<div id="sightseeing__options__cards"></div>');
    } else {
        $('.sightseeing__options__cards').append('<div id="sightseeing__options__cards"></div>');
    }
    if (document.getElementById('sightseeing__category').style.display === 'none') {
        document.getElementById('sightseeing__category').style.display = "";
        document.getElementById('sightseeing__options').style.display = "none";
    } else {
        offset = 0;
        document.getElementById('sightseeing__options').style.display = "";
        document.getElementById('sightseeing__category').style.display = "none";
    }
};
document.getElementById("sightseeing__options__back-btn").addEventListener('click', page_switch);

$(".sightseeing__options__cards").on("touchmove", (e) => {
    e.stopPropagation();
});


function category_btn(category) {
    page_switch();
    if (document.getElementById("more")) {
        document.getElementById("more").remove();
    }
    document.getElementById("bus_loader").style.display = "block";
    get_sights_info(category).then(() => {
        document.getElementById("bus_loader").style.display = "none";
    });
}


export const get_sights_info_search = (place_id) => {
    fetch('place_detail?place_id=' + place_id, {method: 'get'})
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (document.getElementById("sightseeing__options__cards") !== null) {
                document.getElementById('sightseeing__options__cards').remove();
                $('.sightseeing__options__cards').append('<div id="sightseeing__options__cards"></div>');
            } else {
                $('.sightseeing__options__cards').append('<div id="sightseeing__options__cards"></div>');
            }
            let point = data['point'];
            create_card(point);
        }).then(() => {
        if (document.getElementById("more")) {
            document.getElementById("more").remove();
        }
    }).catch((e) => {
        console.log(e);
    })
};