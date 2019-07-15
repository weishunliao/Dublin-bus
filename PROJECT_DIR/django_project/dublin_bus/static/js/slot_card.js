export const get_bus_real_time_info = (stop_id) => {
    fetch('real_time_info_for_bus_stop?stop_id=' + stop_id, {method: 'get'})
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.getElementById("drawer__search__title__label").innerText = stop_id;
            document.getElementById("drawer__search__title__stop-name").innerText = data[stop_id][0][4];
            create_chip(data[stop_id]);
            if (document.getElementById('slot-card') !== null) {
                document.getElementById('slot-card').remove();
                $('#stops__content__wrapper').append('<div id="slot-card"></div>');
            } else {
                $('#stops__content__wrapper').append('<div id="slot-card"></div>');
            }
            for (let i = 0; i < data[stop_id].length; i++) {
                let slot = data[stop_id][i];
                create_card(slot[0], slot[2], slot[3], slot[1]);
            }
        }).catch(function (error) {
        return error;
    })
};


const create_card = (route_id, arrival_time, remain, direction) => {
    let card = '<ion-card class="stops__content__card"> <ion-grid> <ion-row> <ion-col size="6"><ion-item lines="none" ' +
        'class="stops__content__card-header"> <ion-icon name="bus" slot="start" class="stops__content__card-header__icon">' +
        '</ion-icon> <ion-label class="stops__content__card-header__label">' + route_id + '</ion-label> </ion-item> </ion-col> ' +
        '<ion-col align-self-end size="6"> <ion-item lines="none" class="stops__content__card-header__time">' +
        '<ion-label>' + remain + 'mins</ion-label> </ion-item> </ion-col> </ion-row> <ion-row> <ion-col size="8" ' +
        'align-self-baseline> <ion-card-content mode="md" class="stops__content__card-content">Toward <b>' + direction +
        '</b> </ion-card-content> </ion-col> <ion-col size="4"> <ion-card-content mode="md" ' +
        'class="stops__content__card-content__time"> <b>' + arrival_time + '</b> </ion-card-content> </ion-col> </ion-row> ' +
        '</ion-grid> </ion-card>';
    $('#slot-card').append(card);
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