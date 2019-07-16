let resp;
let directionsDisplay;

function initMap() {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 53.3471, lng: -6.26059 },
    zoom: 13
  });
  let directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  let defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(53.281561, -6.364376),
    new google.maps.LatLng(53.400044, -6.215727)
  );

  let input1 = document.querySelector(".route_start");
  let input2 = document.querySelector(".route_end");
   let date = document.getElementById("date");

  


  let options = {
    bounds: defaultBounds,
    types: ["establishment"]
  };
  let autocomplete1 = new google.maps.places.Autocomplete(input1, options);
  let autocomplete2 = new google.maps.places.Autocomplete(input2, options);

  document.getElementById("route_btn").addEventListener("click", function() {
    directionsService.route(
      {
        origin: input1.value,
        destination: input2.value,
        travelMode: "TRANSIT",
        provideRouteAlternatives: true
      },
      function(response, status) {
        resp = response;
        if (status === "OK") {
          $("td").remove();
          for (let i = 0; i < response.routes.length; i++) {
            let agent =
              response.routes[i].legs[0].steps[1].transit.line.agencies[0][
                "name"
              ];
            if (agent !== "Dublin Bus") {
              continue;
            }
            let departure_stop =
              response.routes[i].legs[0].steps[1].transit.departure_stop.name;
            let arrival_stop =
              response.routes[i].legs[0].steps[1].transit.arrival_stop.name;
            let head_sign =
              response.routes[i].legs[0].steps[1].transit.headsign;
            let route_id =
              response.routes[i].legs[0].steps[1].transit.line.short_name;
            let departure_time =
              response.routes[i].legs[0].steps[1].transit.departure_time.text;
            let departure_time_value =
              response.routes[
                i
              ].legs[0].steps[1].transit.departure_time.value.getTime() /
                1000 +
              3600;
            let num_stops =
              response.routes[1].legs[0].steps[1].transit.num_stops;
            let button =
              '<button type="button" class="btn btn-secondary" onclick="change_route(' +
              i +
              ')">Show</button>';
            let walk_to_stop = resp.routes[0].legs[0].steps[0].duration.value;
            let walk_to_destination =
              resp.routes[0].legs[0].steps[2].duration.value;

            $.ajax({
              url: "get_travel_time",
              type: "POST",
              data: {
                route_id: route_id,
                start_point: departure_stop,
                end_point: arrival_stop,
                num_stops: num_stops,
                departure_time_value: departure_time_value
              },
              success: function(resp) {
                console.log(resp);
                if (route_id == "15a") {
                  let full_journey = Math.round(
                    (walk_to_stop + resp.journey_time + walk_to_destination) /
                      60
                  );
                  $("#routes").append(
                    "<tr>" +
                      "<td>" +
                      route_id +
                      "</td>" +
                      "<td>" +
                      head_sign +
                      "</td>" +
                      "<td>" +
                      departure_stop +
                      "</td>" +
                      "<td>" +
                      departure_time +
                      "</td>" +
                      "<td>" +
                      full_journey +
                      " min(s)" +
                      "</td>" +
                      "<td>" +
                      button +
                      "</td>" +
                      "</tr>"
                  );
                }
              }
            });
          }
          directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  });
}

function change_route(route_index) {
  directionsDisplay.setRouteIndex(route_index);
}

window.initMap = initMap;
