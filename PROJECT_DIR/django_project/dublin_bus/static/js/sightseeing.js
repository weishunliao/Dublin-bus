const get_sights_info = (category) => {
    fetch('sights_info?category=' + category, {method: 'get'})
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

            let points = data['points'];
            for (let point of points) {
                create_card(point);
            }
        });
};

const cards = document.getElementsByClassName("sightseeing__category__content__icon");
for (let card of cards) {
    card.addEventListener('click', function () {

        get_sights_info(this.id);
    });
}
get_sights_info("Sightseeing");
const create_card = (point) => {
    let rating = (parseFloat(point[2]) / 5) * 100 + "%";
    let card = '<ion-card><ion-grid><ion-row><ion-col align-self-center size="5" class="sightseeing__options__cards__photo" >' +
        '<img id="sightseeing__options__cards__photo" src="' + point[3] + '"/></ion-col><ion-col align-self-center size="7" ' +
        'class="sightseeing__options__cards__info"><ion-row><ion-col size="12" class="sightseeing__options__cards__info__name">' +
        '<span id="sightseeing__options__cards__info__name">' + point[0] + '</span></ion-col></ion-row><ion-row><ion-col size="12" ' +
        'class="sightseeing__options__cards__info__addr"><span id="sightseeing__options__cards__info__addr">' + point[1] + '</span>' +
        '</ion-col></ion-row><ion-row><ion-col size="12" class=""><div class="sightseeing__options__cards__info__ratting">\n' +
        '<div class="sightseeing__options__cards__info__ratting__top" id="sightseeing__options__cards__info__ratting" ' +
        'style="width: ' + rating + '"> \n' +
        ' <span>★★★★★</span></div><div class="sightseeing__options__cards__info__ratting__bottom"><span>★★★★★</span>' +
        '</div></div></ion-col></ion-row><ion-row><ion-col size="12" class="sightseeing__options__cards__info__opening-hour">' +
        '<ion-icon name="md-time" size="medium"></ion-icon><span id="sightseeing__options__cards__info__opening-hour">' + point[4] + '</span></ion-col></ion-row></ion-col></ion-row>' +
        '</ion-grid></ion-card>';

        $('#sightseeing__options__cards').append(card);
};