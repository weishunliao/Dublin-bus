let route_id;

// $('.typeahead').bind('typeahead:select', function (ev, suggestion) {
//     let type = document.getElementById("suggestion_" + suggestion).dataset.type;
//     console.log(type, suggestion);
//     if (type === 'route') {
//         route_id = suggestion;
//         document.getElementById("direction_switch").checked = false;
//         get_bus_stop_list(route_id, "in");
//         console.log(suggestion);
//         document.getElementById("").innerText = suggestion;
//     } else {
//         get_bus_real_time_info(suggestion);
//     }
// });

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
            return display_stops(data['stops_list']);
        }).then(function (stops) {
        for (let i = 0; i < stops.length; i++) {
            update_real_time(i, stops[i][0], route_id);
        }
    }).catch(function (error) {
        return error;
    })
};

const timeline__content = document.getElementById("timeline__content");
const display_stops = (stops) => {
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
    document.getElementById("drawer__search__title__direction").innerText = stops[0][3];
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
            elem.getElementsByTagName('span')[0].innerHTML = '<ion-icon name="ios-bus"></ion-icon>';
        } else {
            elem.getElementsByTagName('span')[0].innerHTML = data['time'] + 'mins    ' + '<ion-icon name="ios-bus"></ion-icon>';
            ;

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
