let route_id;

$('#typeahead_route').bind('typeahead:select', function (ev, suggestion) {
    // let type = document.getElementById("suggestion_" + suggestion).dataset.type;
    route_id = suggestion;
    document.getElementById("direction_switch").checked = false;
    get_bus_stop_list(route_id, "in");
    // document.getElementById("").innerText = suggestion;
    window.setTimeout(detail2, 800);
});

const get_bus_stop_list = (route_id, direction) => {
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
            return display_stops(data['stops_list'],route_id);
        }).then(function (stops) {
        for (let i = 0; i < stops.length; i++) {
            update_real_time(i, stops[i][0], route_id);
        }
    }).catch(function (error) {
        return error;
    })
};

const timeline__content = document.getElementById("timeline__content");
const display_stops = (stops, route_id) => {
    for (let i of document.querySelectorAll("li")) {
        i.remove();
    }

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
    document.getElementById("routes__content__card__route-id").innerText = route_id;
    return stops;
};


const direction_switch = document.getElementById("direction_switch");
direction_switch.addEventListener("change", () => {
    if (direction_switch.checked === true) {
        get_bus_stop_list(route_id, "out");
    } else {
        get_bus_stop_list(route_id, "in");
    }
});

const update_real_time = (num, stop_id, route_id) => {
    fetch('real_time_for_route?stop_id=' + stop_id + '&route_id=' + route_id, {method: 'get'})
        .then(function (data) {
            return data.json();

        }).then(function (data) {
        let elem = document.querySelectorAll("li")[num];
        if (data['time'] === 'Due') {
            display_bus_arrival_time(num);
            elem.getElementsByTagName('span')[0].innerHTML = '<ion-icon class="bus-icon" name="md-bus" size="large"></ion-icon>';
        } else {
            elem.getElementsByTagName('span')[0].innerHTML = data['time'] + 'mins    ';
        }
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


const detail2 = () => {
    const container = $("#routes-container");
    if (container.css('margin-left') === '0px') {
        container.animate({'margin-left': '-100%'}, 200, 'linear');
    } else {
        container.animate({'margin-left': '0'}, 200, 'linear');
    }
};
document.getElementById("routes__toolbar__back-btn").addEventListener('click', detail2);
const cards = document.getElementsByClassName("routes__content__card");
for (let card of cards) {
    card.addEventListener('click', function () {
        route_id = this.dataset.id;
        get_bus_stop_list(this.dataset.id, this.dataset.direction);
        window.setTimeout(detail2, 800);
    });
}