// import {window_height} from "./stops";

// document.querySelector(".sightseeing__options__cards").style.height = window_height * 0.53 + "px";
const get_sights_info = (category) => {
    return new Promise((resolve, reject) => {
        fetch('sights_info?category=' + category, {method: 'get'})
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // if (document.getElementById("sightseeing__options__cards") !== null) {
                //     document.getElementById('sightseeing__options__cards').remove();
                //     $('.sightseeing__options__cards').append('<div id="sightseeing__options__cards"></div>');
                // } else {
                //     $('.sightseeing__options__cards').append('<div id="sightseeing__options__cards"></div>');
                // }

                let points = data['points'];
                for (let point of points) {
                    create_card(point);
                }
                resolve();
            }).catch(() => {
            reject();
        });
    });
};
const cards = document.getElementsByClassName("sightseeing__category__content__icon");
for (let card of cards) {
    card.addEventListener('click', function () {
        // get_sights_info(this.id);
        category_btn(this.id);
    });
}
const create_card = (point) => {
    let rating = Math.round(parseFloat(point[2]) / 5 * 100) + "%";
    let card = '<ion-card><ion-grid><ion-row><ion-col align-self-center size="5" class="sightseeing__options__cards__photo" >' +
        '<img id="sightseeing__options__cards__photo" src="' + point[3] + '"/></ion-col><ion-col align-self-center size="7" ' +
        'class="sightseeing__options__cards__info"><ion-row><ion-col size="12" class="sightseeing__options__cards__info__name">' +
        '<span id="sightseeing__options__cards__info__name">' + point[0] + '</span></ion-col></ion-row><ion-row><ion-col size="12" ' +
        'class="sightseeing__options__cards__info__addr"><span id="sightseeing__options__cards__info__addr">' + point[1] + '</span>' +
        '</ion-col></ion-row><ion-row><ion-col size="2" class="sightseeing__options__cards__info__ratting__number"><span>' + point[2] + '</span></ion-col><ion-col size="10" class=""><div class="sightseeing__options__cards__info__ratting">\n' +
        '<div class="sightseeing__options__cards__info__ratting__top" id="sightseeing__options__cards__info__ratting" ' +
        'style="width: ' + rating + '"> \n' +
        ' <span>★★★★★</span></div><div class="sightseeing__options__cards__info__ratting__bottom"><span>★★★★★</span>' +
        '</div></div></ion-col></ion-row><ion-row><ion-col size="12" class="sightseeing__options__cards__info__opening-hour">' +
        '<ion-icon name="md-time" size="medium"></ion-icon><span id="sightseeing__options__cards__info__opening-hour">' + point[4] + '</span></ion-col></ion-row></ion-col></ion-row>' +
        '</ion-grid></ion-card>';

    $('#sightseeing__options__cards').append(card);
};

const page_switch = () => {
    if (document.getElementById("sightseeing__options__cards") !== null) {
        document.getElementById('sightseeing__options__cards').remove();
        $('.sightseeing__options__cards').append('<div id="sightseeing__options__cards"></div>');
    } else {
        $('.sightseeing__options__cards').append('<div id="sightseeing__options__cards"></div>');
    }
    if (document.getElementById('sightseeing__category').style.display === 'none') {
        $("#sightseeing__category").fadeIn();
        $("#sightseeing__options").fadeOut();
    } else {
        $("#sightseeing__category").fadeOut();
        $("#sightseeing__options").fadeIn();
    }
};
document.getElementById("sightseeing__options__back-btn").addEventListener('click', page_switch);

$(".sightseeing__options__cards").on("touchmove", function (e) {
    e.stopPropagation();
});


// const controller = document.querySelector('ion-loading-controller');
// function category_btn(category) {
//     // controller.componentOnReady();
//     controller.create({
//         message: 'Please wait...',
//         spinner: 'bubbles',
//     }).then((loading) => {
//         loading.present();
//         get_sights_info(category).then(() => {
//             loading.dismiss();
//             page_switch();
//         });
//     });
// }
function category_btn(category) {
    page_switch();
    document.getElementById("bus_loader").style.display = "";
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
        }).catch((e) => {
        console.log(e);
    })
};