$('#typeahead_stop').bind('typeahead:select', function (ev, suggestion) {
    let type = document.getElementById("suggestion_" + suggestion).dataset.type;
    console.log(type, suggestion);
    get_bus_real_time_info(suggestion);
    setTimeout(detail, 500);
});


const get_bus_real_time_info = (stop_id) => {
    fetch('real_time_info_for_bus_stop?stop_id=' + stop_id, {method: 'get'})
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.getElementById("stops__content__card__stop-id").innerText = stop_id;
            document.getElementById("stops__content__card__stop-name").innerText = data[stop_id][0][4];
            get_stop_server_route(stop_id);
            // create_chip(data[stop_id]);
            if (document.getElementById('slots') !== null) {
                document.getElementById('slots').remove();
                $('#stops__time-table-list').append('<div id="slots"></div>');
            } else {
                $('#stops__time-table-list').append('<div id="slots"></div>');
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
    let slot = '<ion-row class="stops__time-table-list__content">' +
        '<ion-col size="3"><ion-item lines="none"><ion-label ' +
        'class="stops__time-table-list__content__label__bus stops__time-table-list__content__label">' + route_id + '</ion-label>' +
        '</ion-item></ion-col><ion-col size="6"><ion-item lines="none"><ion-label ' +
        'class="stops__time-table-list__content__label__des stops__time-table-list__content__label" text-wrap>' + direction + '</ion-label>' +
        '</ion-item></ion-col><ion-col size="3"><ion-item lines="none"><ion-label ' +
        'class="stops__time-table-list__content__label__time stops__time-table-list__content__label">' + remain + 'mins </ion-label>' +
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


const detail = () => {
    const container = $("#stops-container");
    if (container.css('margin-left') === '0px') {
        container.animate({'margin-left': '-100%'}, 200, 'linear');
    } else {
        container.animate({'margin-left': '0'}, 200, 'linear');
    }
};
document.getElementById("stops__toolbar__back-btn").addEventListener('click', detail);
document.getElementById("stops__content__card").addEventListener('click', function () {
    get_bus_real_time_info(this.dataset.item);
    setTimeout(detail, 500);
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
            console.log(data['server_route'], data['server_route'].length);
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