import {
  search,
  height,
  fromInput,
  toInput,
  dateInput,
  selectedTab,
  Route,
  sightInput,
  fromContainer,
  submitButton,
  controller,
  buildDate
} from "./nodes";
import { searchToggle } from "./index";
import MarkerClusterer from "./markerclusterer";
import { get_bus_real_time_info, detail, drawer_default_height } from "./stops";
import { get_sights_info_search } from "./sightseeing";
import { bottomSwiper } from "./touches";

import { checkFavouriteJourneys } from "./favourites";

const { searchInput } = search;
let resp;

const BOUNDS = {
  north: 54.020858,
  south: 52.324929,
  west: -7.923442,
  east: -4.793763
};

let months = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
};

let daySelection = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat"
};

function dateBuilder(date) {
  let month = months[date.getMonth()];
  let dayDate = date.getDate();
  let year = date.getFullYear();
  let dayName = daySelection[date.getDay()];

  return "" + dayName + ", " + dayDate + " " + month + ", " + year;
}

function transformTimeValue(valueGoesHere) {
  let val = new Date(valueGoesHere);
  val = val.getHours() + ":" + sortLeavingInMinutes(val.getMinutes());

  return val;
}

function sortLeavingInMinutes(val) {
  let ls;
  if (val < 10) {
    ls = "0" + val;
  } else {
    ls = val;
  }
  return ls;
}
export let directionsService;
export let initialLocation;
export let markers = {};
export let map;
export let directionsDisplay;
export let bus_route_drawer;

// const toInputContainer = document.querySelector('#to-input')

// styling for the map - based on https://snazzymaps.com/style/60/blue-gray
let blueGray = [
  {
    featureType: "water",
    stylers: [
      {
        visibility: "on"
      },
      {
        color: "#b5cbe4"
      }
    ]
  },
  {
    featureType: "landscape",
    stylers: [
      {
        color: "#efefef"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#83a5b0"
      }
    ]
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#bdcdd3"
      }
    ]
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e3eed3"
      }
    ]
  },
  {
    featureType: "administrative",
    stylers: [
      {
        visibility: "on"
      },
      {
        lightness: 33
      }
    ]
  },
  {
    featureType: "road"
  },
  {
    featureType: "poi.park",
    elementType: "labels",
    stylers: [
      {
        visibility: "on"
      },
      {
        lightness: 20
      }
    ]
  },
  {},
  {
    featureType: "road",
    stylers: [
      {
        lightness: 20
      }
    ]
  }
];

export default function initMap() {
  // This setTimeout is to ensure the dom has loaded so the map has somewhere to go
  setTimeout(() => {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 53.3471, lng: -6.26059 },
      zoom: 13,
      disableDefaultUI: true,
      styles: blueGray,
      clickableIcons: false,
      restriction: {
        latLngBounds: BOUNDS
      }
    });
    let symbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      strokeWeight: 2,
      scale: 3,
      fillColor: "#FFFFFF",
      strokeColor: "#409CE0",
      fillOpacity: 1
    };

    bus_route_drawer = new google.maps.Polyline({
      geodesic: true,
      strokeColor: "#409CE0",
      strokeOpacity: 1,
      strokeWeight: 6,
      icons: [
        {
          icon: symbol,
          offset: "10%"
        },
        {
          icon: symbol,
          offset: "20%"
        },
        {
          icon: symbol,
          offset: "30%"
        },
        {
          icon: symbol,
          offset: "40%"
        },
        {
          icon: symbol,
          offset: "50%"
        },
        {
          icon: symbol,
          offset: "60%"
        },
        {
          icon: symbol,
          offset: "70%"
        },
        {
          icon: symbol,
          offset: "80%"
        },
        {
          icon: symbol,
          offset: "90%"
        }
      ]
    });
    bus_route_drawer.setMap(null);

    // add markers to the map for all bus stops
    $.getJSON("/static/cache/stops.json", function(data) {
      AddMarkers(data, map);
    });

    let geocoder = new google.maps.Geocoder();

    // create an object for the bus stop icon
    let locationIcon = {
      url: "/static/images/location_route.png", // url for the image
      scaledSize: new google.maps.Size(50, 50), // size of the image
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(25, 50) // anchor
    };

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map,
      markerOptions: { icon: locationIcon }
    });

    let defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(53.281561, -6.364376),
      new google.maps.LatLng(53.400044, -6.215727)
    );

    let options = {
      bounds: defaultBounds,
      types: ["establishment"],
      country: "Ireland"
    };

    const searchAutocomplete = new google.maps.places.Autocomplete(
      searchInput,
      options
    );

    const fromAutocomplete = new google.maps.places.Autocomplete(
      fromInput,
      options
    );

    const toAutocomplete = new google.maps.places.Autocomplete(
      toInput,
      options
    );
    const autocompletes = [toAutocomplete, fromAutocomplete];

    autocompletes.forEach(autocomplete => {
      autocomplete.addListener("place_changed", () => {
        if (
          document
            .querySelector(".journey-planner")
            .classList.contains("converted")
        ) {
          checkFavouriteJourneys();
        }
      });
    });

    const sightAutocomplete = new google.maps.places.Autocomplete(
      sightInput,
      options
    );

    sightAutocomplete.addListener("place_changed", () => {
      let place = sightAutocomplete.getPlace();
      get_sights_info_search(place.place_id);
    });

    if (is_mobile_JS) {
      $("ion-tab-button").addClass("color-add");
    }

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

    let locationMarkers = [];

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            if (locationMarkers.length > 0) {
              locationMarkers[0].setMap(null);
              locationMarkers = [];
            }

            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            mainPosition = pos;
            map.setCenter(mainPosition);
            map.setZoom(17);

            // setTimeout(() => {

            // }, 1000)

            let marker = new google.maps.Marker({
              position: pos,
              map: map,
              icon: "./static/images/location32.png"
            });

            
            locationMarkers.push(marker);
            marker.setAnimation(google.maps.Animation.DROP);

            geocoder.geocode({ location: pos }, function(results, status) {
              if (status === "OK") {
                if (results[0]) {
                  initialLocation = results[0];
                  let res = results[0].formatted_address.slice(0, 30) + "...";

                  fromInput.value = "Current location";
                  fromContainer.classList.add("focussed");
                } else {
                  alert("Unable to find user location")
                }
              } else {
                
              }
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
        controller
          .create({
            color: "primary",
            position: "top",
            message: "Enable location services to make best use of the app :)",
            showCloseButton: true
          })
          .then(toast => {
            setTimeout(() => {
              toast.present();
            }, 1000);
          });
      }
    }

    document
      .getElementById("submitter-form")
      .addEventListener("submit", function(e) {
        e.preventDefault();
        FindMyRoutes(initialLocation, directionsService);
      });
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

let errorText;
//   Dummy text to add extras

//   finString = finString + '<div class="journey-planner__card__right__iconContainer"> <ion-icon class="journey-planner__card__icon journey-planner__card__icon--walk" name="walk"></ion-icon> <div class="journey-planner__card__numberbox journey-planner__card__numberbox">4</div><ion-icon class="journey-planner__card__icon journey-planner__card__icon--arrow" name="arrow-forward"></ion-icon></div>'

function change_route(route_index) {
  directionsDisplay.setRouteIndex(route_index);
}

let allMarkers = [];
window.initMap = initMap;
let markerCluster;

// function for adding markers to a map based on input
function AddMarkers(data, map) {
  // get the latitude, longitude and name of each bus stop
  for (let key in data) {
    let stopID = key;
    let latitude = data[key][0];
    let longitude = data[key][1];
    let stopName = data[key][2];
    let latLng = new google.maps.LatLng(latitude, longitude);
    // create an object for the bus stop icon
    let busStopIcon = {
      url: "/static/images/marker.png", // url for the image
      scaledSize: new google.maps.Size(74, 74), // size of the image
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(37, 74) // anchor
    };
    // generate a marker object for bus stop
    let busMarker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: busStopIcon,
      title: stopName,
      id: stopID
    });

    busMarker.addListener("click", function() {
      markerListener(stopID);
    });

    markers[stopID] = busMarker;
    allMarkers.push(busMarker);
  }
  //   let clusterStyles = [
  //     {
  //       url: '/static/images/m3.png',
  //       textColor: "rgba(0,0,0)",
  //       width: 100,
  //       textSize: 16
  //     }
  //   ];

  let mcOptions = {
    imagePath: "/static/images/m",
    ignoreHidden: true
  };

  markerCluster = new MarkerClusterer(map, allMarkers, mcOptions);
}

export const markerListener = stopID => {
  document
    .querySelector("ion-tabs")
    .getSelected()
    .then(function(current_tab) {
      if (current_tab === "stops") {
        document
          .querySelector("ion-tabs")
          .select("none")
          .then(() => {
            document.querySelector("ion-tabs").select("stops");
          });
      } else {
        document.querySelector("ion-tabs").select("stops");
      }
      const stops_container_position = $("#stops-container").css("margin-left");
      if (stops_container_position === "0px") {
        detail();
      }
      get_bus_real_time_info(stopID);
      change_btn();
    });
};

const change_btn = () => {
  document.getElementById("stops__toolbar__back-btn").innerText = "";
  document.getElementById("stops__show-on-map-btn__name").style.display =
    "none";
  $("#stops__toolbar__back-btn").append(
    "<ion-icon name='md-close' size='medium'></ion-icon>"
  );
  document
    .getElementById("stops__toolbar__back-btn")
    .removeEventListener("click", detail);
  document
    .getElementById("stops__toolbar__back-btn")
    .addEventListener("click", close_btn);
};

const close_btn = () => {
  bottomSwiper.changeState(bottomSwiper.IN_STATE, null);
  document.getElementById("stops__toolbar__back-btn").innerText = "";
  $("#stops__toolbar__back-btn").append(
    "<ion-icon name='arrow-back'></ion-icon>Back"
  );
  document.getElementById("stops__show-on-map-btn__name").style.display = "";
  document
    .getElementById("stops__toolbar__back-btn")
    .removeEventListener("click", close_btn);
  document
    .getElementById("stops__toolbar__back-btn")
    .addEventListener("click", detail);
};

export function FindMyRoutes(initialLocation, directionsService) {
  submitButton.innerHTML = "Go";
  hideMarkers();


  let theight = document
    .querySelector(".tabbar-container")
    .getBoundingClientRect().height;

  document.querySelector(".journey-planner__routes-container").style.height =
    height - 160 - theight - height * 0.03 + "px";

  let date = new Date(dateInput.value);

  // [date.getDay()]
  let formattedDate = dateBuilder(date);

  document.querySelector("#routesHere").innerHTML = `
  
  <div class="loader__wrapper loader-jp" id="bus_loader-jp">
  <h3>Please wait...</h3><br>
  <div>
      <img src="/static/images/bus.png" alt="" class="loader__bus">
  </div>
  <div class="loader__wrapper2">
      <img src="/static/images/road.png" alt="" class="loader__road"/>
  </div>
        </div>
  
  `;

  document.querySelector(".journey-planner").classList.add("converted");
  let fromLocation;
  if (fromInput.value === "Current location") {
    fromLocation = initialLocation;
    fromInput.value = fromLocation.formatted_address;
    fromInput.style.color = "#3D5F7E";
  } else {
    fromLocation = fromInput.value;
  }
  checkFavouriteJourneys();

  directionsService.route(
    {
      origin: fromInput.value,
      destination: toInput.value,
      travelMode: "TRANSIT",
      transitOptions: {
        departureTime: new Date(dateInput.value)
        // modes: ['BUS'],
        // routingPreference: 'FEWER_TRANSFERS'
      },
      provideRouteAlternatives: true
    },

    async function(response, status) {
      try {
        resp = response;
        if (status === "OK") {
         
          for (let i = 0; i < response.routes.length; i++) {
            let directions = new google.maps.DirectionsRenderer({
              preserveViewport: true,
              directions: response,
              routeIndex: i
            });
            let length = response.routes[i].legs[0].steps.length;
            let error_count = 0; // used to track if any steps in the route are not run by Dublin Bus
            for (let j = 0; j < length; j++) {
              if (
                response.routes[i].legs[0].steps[j].travel_mode == "TRANSIT"
              ) {
                let agent =
                  response.routes[i].legs[0].steps[j].transit.line.agencies[0][
                    "name"
                  ];
                if (agent !== "Dublin Bus") {
                  error_count++;
                }
              }
            }
            if (error_count > 0) {
              continue;
            }
            let full_travel_time = 0;
            let button =
              '<button type="button" class="btn btn-secondary" onclick="change_route(' +
              i +
              ')">Show</button>';
            let step = 0;
            let routeDescription = [];
            let journeyTimeReturnedFromModel = [];
            let start = response.routes[i].legs[0].start_address;
            let routeSetOff = response.routes[
              i
            ].legs[0].departure_time.value.getTime();
            let routeArrive = response.routes[
              i
            ].legs[0].arrival_time.value.getTime();
            routeSetOff = transformTimeValue(routeSetOff);
            routeArrive = transformTimeValue(routeArrive);
            let end = response.routes[i].legs[0].end_address;
            let departure_stop = "";
            let route_id = "Walking";
            let head_sign = "";
            let departure_time = "";
            let leavingIn;
            let leavingInValue;
            let leavingCounter = 0;
            let firstLeavingIn;

            while (step < length) {
              let duration =
                response.routes[i].legs[0].steps[step].duration.text;
              let distance =
                response.routes[i].legs[0].steps[step].distance.text;
              let travel_mode =
                response.routes[i].legs[0].steps[step].travel_mode;
              if (travel_mode === "WALKING") {
                let walkTime =
                  response.routes[i].legs[0].steps[step].duration.value;
                full_travel_time += walkTime;
                let departurePoint = routeDescription.push([
                  "walking",
                  walkTime,
                  distance,
                  null,
                  null,
                  start,
                  end,
                  duration,
                  Math.round(walkTime / 60)
                ]);
              } else {
                // clear this when the server is back
                let departureStop =
                  response.routes[i].legs[0].steps[step].transit.departure_stop
                    .name;
                let arrivalStop =
                  response.routes[i].legs[0].steps[step].transit.arrival_stop
                    .name;

                let ct = Date.now() / 1000;

                let busTimeStamp =
                  response.routes[i].legs[0].steps[
                    step
                  ].transit.departure_time.value.getTime() / 1000;

                leavingIn = Math.floor((busTimeStamp - ct) / 60);

                leavingInValue = response.routes[i].legs[0].steps[
                  step
                ].transit.departure_time.value.getTime();

                leavingInValue = transformTimeValue(leavingInValue);

                if (!leavingCounter) {
                  firstLeavingIn = leavingInValue;
                  leavingCounter++;
                }

                let num_stops =
                  response.routes[i].legs[0].steps[step].transit.num_stops;
                departure_stop =
                  response.routes[i].legs[0].steps[step].transit.departure_stop
                    .name;
                let arrival_stop =
                  response.routes[i].legs[0].steps[step].transit.arrival_stop
                    .name;
                let departure_time_value =
                  response.routes[i].legs[0].steps[
                    step
                  ].transit.departure_time.value.getTime() /
                    1000 +
                  3600;
                route_id =
                  response.routes[i].legs[0].steps[step].transit.line
                    .short_name;
                head_sign =
                  response.routes[i].legs[0].steps[step].transit.headsign;
                departure_time =
                  response.routes[i].legs[0].steps[step].transit.departure_time
                    .text;

                await fetch("get_travel_time", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                  },
                  body: JSON.stringify({
                    route_id: route_id,
                    start_point: departure_stop,
                    end_point: arrival_stop,
                    num_stops: num_stops,
                    departure_time_value: departure_time_value,
                    head_sign: head_sign
                  })
                })
                  .then(response => {
                    return response.json();
                  })
                  .then(data => {
                    journeyTimeReturnedFromModel.push(data.journey_time);
                    full_travel_time += data.journey_time;
                    routeDescription.push([
                      "bus",
                      route_id,
                      distance,
                      departureStop,
                      arrivalStop,
                      start,
                      end,
                      Math.round(data.journey_time / 60) + " mins",
                      leavingInValue
                    ]);
                  });
              }
              step++;
            }
            if (true) {
              const newDirections = directions.directions.routes.slice(
                i,
                i + 1
              );
              // the directions object is adjusted to only contain the information about one particular route
              // this is so that we can associate the directions with a particular card
              directions.directions.routes = newDirections;

              if (!leavingIn) {
                leavingIn = "N/A";
              }

              const newRoute = new Route({
                route: [response.routes[i]],
                full_travel_time,
                directions,
                routeDescription,
                departure_time,
                id: i,
                firstLeavingIn,
                routeSetOff,
                routeArrive,
                leavingInValue,
                leavingIn,
                formattedDate,
                journeyTimeReturnedFromModel
              });
            
              Route.appendToDom(newRoute);
            }
          }
          document.querySelector("#routesHere").innerHTML = "";
          Route.signalAppend();
        } else {
       
          document.querySelector("#routesHere").innerHTML = "";
          errorText = `
          <div class="error-container">
          
          <div class="error-inner">
          
          <h2>I'm sorry - something went wrong, please try again</h2>

          </div>
          
          </div>
          `;
          document.querySelector("#routesHere").innerHTML = errorText;
        }
      } catch (err) {
        document.querySelector("#routesHere").innerHTML = "";
        errorText = `
          <div class="error-container">
          
          <div class="error-inner">
          
          <h2>No response received - please check your internet connection :( </h2>

          </div>
          
          </div>
          `;
        document.querySelector("#routesHere").innerHTML = errorText;
       
      }
    }
  );
}


export const hideMarkers = () => {
    allMarkers.forEach(marker => {
        marker.setVisible(false)
    });
    markerCluster.repaint()
}

export const showMarkers = () => {

    for (let marker of allMarkers){
        if (marker.getVisible()){
            break;
        } else {
            marker.setVisible(true)
        }
    }
    
    markerCluster.repaint()
}