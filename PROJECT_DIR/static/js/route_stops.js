const stops = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: choices_list,
});
const routes = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: route_list,
});

$('#route_stop_info .typeahead').typeahead({
        highlight: true,
        minLength: 1,
        hint: true,
    },
    {
        name: 'stops',
        source: stops,
        templates: {
            header: '<h3 class="league-name">Stops</h3>'
        }
    },
    {
        name: 'routes',
        source: routes,
        templates: {
            header: '<h3 class="league-name">Routes</h3>'
        }
    });
let route_id;
const route_stop_info = document.getElementById("route_stop_info1");
new autoComplete({
    selector: route_stop_info,
    minChars: 1,
    source: function (term, suggest) {
        term = term.toLowerCase();
        let choices = choices_list;
        let matches = [];
        for (let i = 0; i < choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
        suggest(matches);
    },
    onSelect: function (e, term, item) {
        console.log(term);
        route_id = term.substring(1);
        document.getElementById("direction_switch").checked = false;
        get_bus_stop_list(route_id, "in");
        document.getElementById("drawer__search__title__label").innerText = term;
    }
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
    fetch('get_real_time?stop_id=' + stop_id + '&route_id=' + route_id, {method: 'get'})
        .then(function (data) {
            return data.json();

        }).then(function (data) {
        let elem = document.querySelectorAll("li")[num];
        if (data['time'] === 'Due') {
            display_bus_arrival_time(num);
            elem.getElementsByTagName('span')[0].innerHTML = 'Due    ' + '<ion-icon name="ios-radio"></ion-icon>';
        } else {
            elem.getElementsByTagName('span')[0].innerHTML = data['time'] + 'mins    ' + '<ion-icon name="ios-radio"></ion-icon>';
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

const route_list = ['1', '102', '104', '11', '111', '114', '116', '118', '120', '122', '123', '13', '130',
    '14', '140', '142', '145', '14c', '15', '150', '151', '155', '15a', '15b', '15d', '16', '161',
    '16c', '16d', '17', '17a', '18', '184', '185', '220', '236', '238', '239', '25', '25a', '25b',
    '25d', '25x', '26', '27', '270', '27a', '27b', '27x', '29a', '31', '31a', '31b', '31d', '32', '32x',
    '33', '33a', '33b', '33d', '33e', '33x', '37', '38', '38a', '38b', '38d', '39', '39a', '39x', '4',
    '40', '40b', '40d', '40e', '41', '41a', '41b', '41c', '41d', '41x', '42', '42d', '43', '44', '44b',
    '451', '45a', '46a', '46e', '47', '49', '51d', '51x', '53', '54a', '56a', '59', '61', '63', '65',
    '65b', '66', '66a', '66b', '66e', '66x', '67', '67x', '68', '68a', '68x', '69', '69x', '7', '70',
    '70d', '747', '75', '757', '76', '76a', '77a', '77x', '79', '79a', '7a', '7b', '7d', '8', '83',
    '83a', '84', '84a', '84x', '86', '9'];

const choices_list = [
    "7612s",
    "0002s",
    "0003s",
    "0004s",
    "0006s",
    "0007s",
    "0008s",
    "0010s",
    "0011s",
    "0012s",
    "0014s",
    "0015s",
    "0016s",
    "0017s",
    "0018s",
    "0019s",
    "0021s",
    "0022s",
    "0023s",
    "0024s",
    "0025s",
    "0027s",
    "0028s",
    "0029s",
    "0030s",
    "0031s",
    "0032s",
    "0033s",
    "0035s",
    "0036s",
    "0037s",
    "0038s",
    "0039s",
    "0040s",
    "0041s",
    "0042s",
    "0043s",
    "0044s",
    "0045s",
    "0046s",
    "0047s",
    "0048s",
    "0049s",
    "0051s",
    "0052s",
    "0053s",
    "0054s",
    "0055s",
    "0056s",
    "0057s",
    "0058s",
    "0059s",
    "0060s",
    "0063s",
    "0064s",
    "0065s",
    "0066s",
    "0068s"];