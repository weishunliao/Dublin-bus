import { search, fromInput, toInput } from "./nodes";
import { searchToggle } from "./index";

const { searchInput } = search;
let resp;
let directionsDisplay;



export default function initMap() {
  setTimeout(() => {
    let map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 53.3471, lng: -6.26059 },
      zoom: 13,
      disableDefaultUI: true
    });
 
  // add markers to the map for all bus stops
  $.getJSON('/static/cache/stops.json', function(data) {         
    AddMarkers(data, map);
  });  

  let directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  let defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(53.281561, -6.364376),
    new google.maps.LatLng(53.400044, -6.215727)
  );

  let options = {
    bounds: defaultBounds,
    types: ["establishment"]
  };


  const searchAutocomplete = new google.maps.places.Autocomplete(
    searchInput,
    options
  );

  const fromAutocomplete = new google.maps.places.Autocomplete(
    fromInput,
    options,

  );
  const toAutocomplete = new google.maps.places.Autocomplete(
    toInput,
    options,
    
  );

  searchAutocomplete.addListener("place_changed", function() {
    var place = searchAutocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17); // Why 17? Because it looks good.
    }

    searchToggle();
    searchInput.value = "";
    // marker.setPosition(place.geometry.location);
    // marker.setVisible(true);

    // var address = '';
    // if (place.address_components) {
    //   address = [
    //     (place.address_components[0] && place.address_components[0].short_name || ''),
    //     (place.address_components[1] && place.address_components[1].short_name || ''),
    //     (place.address_components[2] && place.address_components[2].short_name || '')
    //   ].join(' ');
    // }

    // infowindowContent.children['place-icon'].src = place.icon;
    // infowindowContent.children['place-name'].textContent = place.name;
    // infowindowContent.children['place-address'].textContent = address;
    // infowindow.open(map, marker);
  });

  let mainPosition;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          mainPosition = pos;

          var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: "Hello World!",
            icon: "./static/images/location32.png"
          });
        },
        function() {
          handleLocationError(true, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, pos) {
      alert(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
    }
  }

  getLocation();

  const centerOfDublin = new google.maps.LatLng(53.350287, -6.260574);
  map.setCenter(centerOfDublin);
  map.setZoom(15);

  $(".location-button").click(() => {
    getLocation();
    map.setCenter(mainPosition);
    map.setZoom(17);
  });
}, 200);

 
}

function change_route(route_index) {
  directionsDisplay.setRouteIndex(route_index);
}

window.initMap = initMap;

// function for adding markers to a map based on input
function AddMarkers(data, map) {
  // get the latitude, longitude and name of each bus stop
  for (let key in data) {
      let latitude = data[key][1];
      let longitude = data[key][2];
      let stopName = data[key][0];
      let latLng = new google.maps.LatLng(latitude, longitude);
      // create an object for the bus stop icon
      let busStopIcon = {
        url: '/static/images/marker.png', // url for the image
        scaledSize: new google.maps.Size(60, 60), // size of the image
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(30, 60) // anchor
      };
      // generate a marker object for bus stop
      let busMarker = new google.maps.Marker({
        position: latLng,  
        map: map,
        icon: busStopIcon,  
        title: stopName
      });
    }
}
//   function() {
//     handleLocationError(true, infoWindow, map.getCenter());
//   }

// else {
//     // Browser doesn't support Geolocation
//     handleLocationError(false, infoWindow, map.getCenter());
//   }

//         var startPos;

//         var geoSuccess = function(position) {
//         //   hideNudgeBanner();
//         //   // We have the location, don't display banner
//         //   clearTimeout(nudgeTimeoutId);

//           // Do magic with location
//           startPos = position;
//           document.getElementById('startLat').innerHTML = startPos.coords.latitude;
//           document.getElementById('startLon').innerHTML = startPos.coords.longitude;
//         };

//         let currentPosition = navigator.geolocation.getCurrentPosition(geoSuccess);
//         console.log(currentPosition)

//   })

//   let input1 = document.querySelector(".route_start");
//   let input2 = document.querySelector(".route_end");
//   let date = document.getElementById("date");

//   let autocomplete1 = new google.maps.places.Autocomplete(input1, options);
//   let autocomplete2 = new google.maps.places.Autocomplete(input2, options);

//   document.getElementById("route_btn").addEventListener("click", function() {
//     let styler = "translateY(-100%)";
//     $(".drawer__jp__routes").fadeIn("slow");
//     // $(".drawer__jp__routes").css("transform", styler);
//     cover.style.webkitTransform = styler;
//     cover.style.MozTransform = styler;
//     cover.style.msTransform = styler;
//     cover.style.webkitTransform = styler;
//     cover.style.transform = styler;

//     let slice1 = input1.value.split(" ");
//     let slice2 = input2.value.split(" ");

//     let sl1 = "";
//     let sl2 = "";
//     for (let i = 0; i < 3; i++) {
//       sl1 = sl1 + " " + slice1[i];
//       sl2 = sl2 + " " + slice2[i];
//     }

//     $("#from-span").text(sl1);
//     $("#to-span").text(sl2);

//     $(".drawer__jp__routes").fadeIn("slow");

//     directionsService.route(
//       {
//         origin: input1.value,
//         destination: input2.value,
//         travelMode: "TRANSIT",
//         provideRouteAlternatives: true
//       },
//       function(response, status) {
//         resp = response;
//         if (status === "OK") {
//           $("td").remove();
//           for (let i = 0; i < response.routes.length; i++) {
//             let agent =
//               response.routes[i].legs[0].steps[1].transit.line.agencies[0][
//                 "name"
//               ];
//             if (agent !== "Dublin Bus") {
//               continue;
//             }
//             let departure_stop =
//               response.routes[i].legs[0].steps[1].transit.departure_stop.name;
//             let arrival_stop =
//               response.routes[i].legs[0].steps[1].transit.arrival_stop.name;
//             let head_sign =
//               response.routes[i].legs[0].steps[1].transit.headsign;
//             let route_id =
//               response.routes[i].legs[0].steps[1].transit.line.short_name;
//             let departure_time =
//               response.routes[i].legs[0].steps[1].transit.departure_time.text;
//             let departure_time_value =
//               response.routes[
//                 i
//               ].legs[0].steps[1].transit.departure_time.value.getTime() /
//                 1000 +
//               3600;
//             let num_stops =
//               response.routes[1].legs[0].steps[1].transit.num_stops;
//             let button =
//               '<button type="button" class="btn btn-secondary" onclick="change_route(' +
//               i +
//               ')">Show</button>';
//             let walk_to_stop = resp.routes[0].legs[0].steps[0].duration.value;
//             let walk_to_destination =
//               resp.routes[0].legs[0].steps[2].duration.value;

//             let properData = {
//               route_id,
//               departure_stop,
//               arrival_stop,

//             };

//             $.ajax({
//               url: "get_travel_time",
//               type: "POST",
//               data: {
//                 route_id: route_id,
//                 start_point: departure_stop,
//                 end_point: arrival_stop,
//                 num_stops: num_stops,
//                 departure_time_value: departure_time_value
//               },
//               success: function(resp) {
//                 console.log(resp, properData);
//                 if (route_id == "15a") {
//                   let full_journey = Math.round(
//                     (walk_to_stop + resp.journey_time + walk_to_destination) /
//                       60
//                   );
//                   //   $("#routes").append(
//                   //     "<tr>" +
//                   //       "<td>" +
//                   //       route_id +
//                   //       "</td>" +
//                   //       "<td>" +
//                   //       head_sign +
//                   //       "</td>" +
//                   //       "<td>" +
//                   //       departure_stop +
//                   //       "</td>" +
//                   //       "<td>" +
//                   //       departure_time +
//                   //       "</td>" +
//                   //       "<td>" +
//                   //       full_journey +
//                   //       " min(s)" +
//                   //       "</td>" +
//                   //       "<td>" +
//                   //       button +
//                   //       "</td>" +
//                   //       "</tr>"
//                   //   );

//                   $(".drawer__jp__routes").append(
//                     `<div class="drawer__jp__routes__option">

//                     <div class="drawer__jp__routes__busnumber-container">
//                         <p id="busnumber">${route_id}</p>
//                     </div>

//                     <div class="drawer__jp__routes__stops-container">
//                         <div class="drawer__jp__routes__stops-inner drawer__jp__routes__stops-inner--leaves">
//                             <p>Leaves from: <span id="leave-span">${departure_stop}</span></p>
//                         </div>
//                         <div class="drawer__jp__routes__stops-inner drawer__jp__routes__stops-inner--arrives">
//                             <p>Arrives: <span id="arrive-span">${arrival_stop}</span></p>
//                         </div>
//                         <div class="drawer__jp__routes__stops-inner drawer__jp__routes__stops-inner--time">
//                 <p>Departure time: <span id="time-span">${departure_time}</span></p>
//             </div>
//                     </div>
//                     </div>
// `
//                   );
//                 }
//               }
//             });
//           }
//           directionsDisplay.setDirections(response);
//         } else {
//           window.alert("Directions request failed due to " + status);
//         }
//       }
//     );
//   });
