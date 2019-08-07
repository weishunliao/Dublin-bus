import { bottomSwiper } from "./touches";
import { directionsDisplay } from "./google_maps";
import { checkFavouriteJourneys } from "./favourites";

const topDrawer = document.querySelector(".drawer__container--top");
const bottomDrawer = document.querySelector(".drawer__container--bottom");
const searchButton = document.querySelector(".search-button");
const searchContainer = document.querySelector(".search-container");
const searchInput = document.querySelector(".search-input");
export const sightInput = document.querySelector("#search-sightseeing");
export const dateInput = document.querySelector("ion-datetime");
export const dateContainer = document.querySelector("#departing-container");
export const submitButton = document.querySelector("#sub-button");
export const controller = document.querySelector("ion-toast-controller");

export let showContainer = document.querySelector("#show-container");
export let cardShowing = false;

export function changeCardShowing() {
  cardShowing = false;
  showContainer.style.display = "none";
  directionsDisplay.set("directions", null);
}

document
  .querySelector("ion-datetime")
  .setAttribute("min", new Date().toISOString());
document.querySelector("ion-datetime").setAttribute("max", "2021");

export let selectedTab = $("ion-tab-button#tab-button-journey");
export const jpFormInputs = $(".journey-planner__form__input");
export const fromInput = document.querySelector("#from");
export const fromContainer = document.querySelector("#from-container");
export const toInput = document.querySelector("#to");

const allInputs = document.querySelectorAll("input");

allInputs.forEach(input =>
  input.addEventListener("click", e => e.target.select())
);

let jpInputs = [fromInput, toInput];

// jpInputs.forEach(input => {
//     input.addEventListener('change', () => {
//         if (document.querySelector('.journey-planner').classList.contains('converted')){
//             checkFavouriteJourneys();
//         }
//     })
// })

let body = document.body,
  html = document.documentElement;
export let height = Math.max(
  body.scrollHeight,
  body.offsetHeight,
  html.clientHeight,
  html.scrollHeight,
  html.offsetHeight
);

export const drawers = {
  top: topDrawer,
  bottom: bottomDrawer
};

export function switchUpText() {
  let selection = [
    "Take me for a ride!",
    "Bus me!",
    "Vroom vroom!",
    "The wheels on the bus...",
    "Let's go!",
    "Trip me!",
    "Go public transport!",
    "Let's bus!",
    "RT_Trips gave my CPU a stroke"
  ];

  let num = Math.floor(Math.random() * selection.length);
  let relText = selection[num];
  submitButton.innerHTML = relText;
}

let collectionOfRoutes = [];

export class Route {
  constructor(routeData) {
    this.routeData = routeData;
    this.nodeHTML = Route.cardBuilder(
      routeData.routeDescription,
      routeData.departureTime,
      routeData.id,
      routeData.full_travel_time,
      routeData.leavingIn,
      routeData.leavingInValue,
      routeData.formattedDate
    );

    this.domNode = null;
    this.showContainer = document.querySelector("#show-container");
    this.routeInfo = routeData.route;
    this.directions = routeData.directions;
    this.routeDescription = routeData.routeDescription;
    this.leavingIn = routeData.leavingIn;
    this.leavingInValue = routeData.leavingInValue;
    this.firstLeavingIn = routeData.firstLeavingIn;
    this.routeSetOff = routeData.routeSetOff;
    this.routeArrive = routeData.routeArrive;
  }

  static addClick(route) {
    route.domNode.addEventListener("click", () => {
      //   remove color add to show journey planner is still in use
      bottomSwiper.jp_active = true;
      bottomSwiper.changeState(bottomSwiper.LOWERED_STATE)
      // remove the journey_planner form
      document.querySelector(".journey-planner__form").style.display = "none";
      // remove the journeys being shown
      document.querySelector("#routesHere").style.display = "none";
      document
        .querySelector(".journey-planner__form-container")
        .classList.add("journeyFocus");

      let el = document.createElement("div");
      el.setAttribute("class", "journey-planner__showscreen");

      el.innerHTML = `
    <div class="journey-planner__showscreen__buttons">
        <div class="left-button general-button">
            <ion-icon class="button-icon button-icon--left" name="arrow-back"></ion-icon>
            <h3 class="button-text button-text--left">Go back</h3>
        </div>
        <div class="right-button general-button">
        <ion-icon class="button-icon button-icon--right" name="arrow-dropup-circle"></ion-icon>
        <h3 class="button-text button-text--right">Go forward</h3>
       
        </div>
    </div>

    <div class="journey-planner__showscreen__journeyInfo">
        ${route.nodeHTML}
    </div>
    `;

      document.querySelector(".journey-planner__form-container").prepend(el);

      document.querySelector(
        ".journey-planner__moreInfoContainer"
      ).style.display = "block";

      bottomSwiper.tabs.removeClass("color-add");
      cardShowing = true;
      directionsDisplay.setDirections(route.directions.directions);
      let showCardOpen = false;
      const infoText = document.querySelector("#infoText");

      const showContainer = document.querySelector("#show-container");
      const card = document.querySelector("#stretchCard");

      const backToRoutes = document.querySelector("#backToRoutes");

      //   the div that the route sections are going in is:
      const journeyDetails = document.querySelector(
        ".journey-planner__moreInfoContainer"
      );

      journeyDetails.innerHTML = Route.moreInfoBuilder(
        route.routeDescription,
        route.leavingInValue,
        route.routeSetOff,
        route.routeArrive
      );

      let leftButton = document.querySelector('.left-button');
        leftButton.addEventListener("click", () => {
            bottomSwiper.changeState(bottomSwiper.OUT_STATE)
            document.querySelector(
                ".journey-planner__moreInfoContainer"
              ).style.display = "none";
              document.querySelector(".journey-planner__form").style.display = "block";
      // remove the journeys being shown
      document.querySelector("#routesHere").style.display = "block";
      document
      .querySelector(".journey-planner__form-container")
      .classList.remove("journeyFocus");
      document.querySelector('.journey-planner__showscreen').style.display ="none";

    
        });

        let rightButton = document.querySelector('.right-button');

        rightButton.addEventListener("click", () => {
          bottomSwiper.changeState(bottomSwiper.OUT_STATE);
        });
    });
  }

  static appendToDom(route) {
    collectionOfRoutes.push(route);
  }

  static signalAppend() {
    collectionOfRoutes.sort((a, b) => {
      return a.leavingIn > b.leavingIn;
    });

    collectionOfRoutes.forEach(route => {
      $("#routesHere").append(
        Route.jpDisplayCard(route.nodeHTML, route.routeData.id)
      );
      route.domNode = document.querySelector(`#route-${route.routeData.id}`);
      Route.addClick(route);
    });

    collectionOfRoutes = [];
  }

  static leavingInStringBuilder(leavingIn, leavingInValue) {
    let buildString;
    let inOrAt;
    let future = false;
    let mins;
    if (leavingIn < 60) {
      buildString = leavingIn;
      inOrAt = "in";
      mins = "mins";
    } else if (leavingIn === "N/A") {
      buildString = leavingIn;
      inOrAt = "in";
      mins = "";
    } else {
      buildString = leavingInValue;
      inOrAt = "at";
      future = true;
      mins = "";
    }

    return [buildString, inOrAt, future, mins];
  }

  static cardBuilder(
    routeDescription,
    departureTime,
    id,
    full_travel_time,
    leavingIn,
    leavingInValue,
    formattedDate
  ) {
    let [leavingInString, inOrAt, future, mins] = Route.leavingInStringBuilder(
      leavingIn,
      leavingInValue
    );

    // <p>${leavingInValue}</p>
    const card = `
            <div class="journey-planner__card__container">
       
              <div class="journey-planner__card__left">
                <div class="journey-planner__card__left__depTitle">
                  <h2
                    class="journey-planner__card__title journey-planner__card__title--departingTitle"
                  >
                    Departing ${inOrAt}: 
                  </h2>
                </div>
            
                  <h1 class="journey-planner__card__timeTitle  ${
                    future ? "futureTimeTitle" : ""
                  }">
                  ${leavingInString}<span class="journey-planner__card__timeTitle__mins">${mins}</span>
                  </h1>
                ${
                  future
                    ? `<h3 class="journey-planner__card__left__futureTitle"> ${formattedDate}</h3>`
                    : ""
                }
              </div>
              <div class="journey-planner__card__right">
                <div class="journey-planner__card__right__travelTime">
                  <h2
                    class="journey-planner__card__title journey-planner__card__title--departingTitle"
                  >
                    Travel time:
                    <span
                      class="journey-planner__card__timeNumber"
                      id="jp-travel-time"
                      >${Math.round(full_travel_time / 60)}</span
                    > mins
                  </h2>
                </div>
                <div
                  class="journey-planner__card__right__descriptionContainer" id="route-descriptions"
                > 
              
                ${Route.iconsBuilder(routeDescription)}
                </div>
              </div>
            </div>
          `;

    return card;
  }

  static iconsBuilder(routeDescription) {
    let counter = 0;
    let finString = "";
    let walking;
    routeDescription.forEach(routeSection => {
      let icon;
      let finalArr;
      let walkTimeOrBusNo;
      if (routeSection[0] == "walking") {
        walking = true;
        walkTimeOrBusNo = Math.round(routeSection[1] / 60);
        icon = `<ion-icon class="journey-planner__card__icon journey-planner__card__icon--walk" name="walk"></ion-icon>`;
      } else {
        walking = false;
        walkTimeOrBusNo = routeSection[1];
        icon = `<ion-icon class="journey-planner__card__icon journey-planner__card__icon--bus" name="bus"></ion-icon>`;
      }

      if (counter + 1 == routeDescription.length) {
        finalArr = "";
      } else {
        finalArr = `<ion-icon class="journey-planner__card__icon journey-planner__card__icon--arrow" name="arrow-forward"></ion-icon>`;
      }

      counter++;

      finString =
        finString +
        `<div class="journey-planner__card__right__iconContainer">
                          ${icon}
                          <div class="journey-planner__card__numberbox journey-planner__card__numberbox ${
                            walking ? "walking-numberbox" : "bus-numberbox"
                          }">${walkTimeOrBusNo}</div>
                          ${finalArr}
                    </div>`;
    });
    return finString;
  }

  static moreInfoBuilder(routeDescription, leavingInVal, departureTime, arrivalTime) {
    /*
    routeDescription explained:
    0: 'walking' or 'bus' - String
    1: either seconds for walking (number) or the bus number if it;s the bus (string)
    2: distance

    */

    let icon;

    let finString = "";
    let travelText;
    let lastAddedTime;
    let destinationText;
    let four = "DESTINATION";
    let whereWeAre;
    let whereWeAreGoing;
    let timeAdd = 0;
    let beforeColon = 2;
    let afterIndex = 3;

    //   time num is the leaving time as a string
    let timeNum = parseInt(
      leavingInVal.substr(0, beforeColon) + leavingInVal.substr(afterIndex)
    );
    let buildString =
      timeNum.toString().slice(0, 2) + ":" + timeNum.toString().slice(-2);
    routeDescription.forEach((routeSection, index) => {
      if (index === 0) {
        whereWeAre = routeSection[4];
      }

      destinationText = routeSection[2];

      function provideWalkTime(prevBusJourneyTime, prevBusLeaveTime) {
        let fin;
      /** this function:
       * * takes in the departure time of the previous bus.
       * * We have to add prevBusJourneyTime to prevBusLeave Time
       *
       * ? They are both strings on input
       * *
       * /
       */
      let firstTwo = prevBusLeaveTime.slice(0, 2);
    
      let lastTwo = prevBusLeaveTime.slice(-2);
      
    
      let lastTwoAsNum = parseInt(lastTwo);
      let prevBusJTasNum = parseInt(prevBusJourneyTime);
    
    
      // * have we crossed the hour boundary?
      if (prevBusJTasNum + lastTwoAsNum >= 60) {
    let fin;
        let newTwo;
        // * have we crossed the day boundary?
        if (firstTwo === "23") {
    
          newTwo = "00";
        } else {
          newTwo = (parseInt(firstTwo) + 1).toString();
        }
        // * adjust the minutes
        lastTwo = parseInt(prevBusJTasNum + lastTwoAsNum - 60);
        if (lastTwo.toString().length < 2) {
          lastTwo = "0" + lastTwo;
        }
    
        
        fin = newTwo + ":" + lastTwo;
        lastAddedTime = fin;
        return fin
      } else {
        let newMinutes = lastTwoAsNum + prevBusJTasNum;
        if (newMinutes.toString().length < 2) {
            newMinutes = "0" + newMinutes;
          }
        console.log("newMinutes", newMinutes);
        fin = firstTwo + ":" + newMinutes;
        lastAddedTime = fin
        return fin
      }
    }
    

      function provideTime(currentIndex) {
          let prev;
        if (currentIndex === 0) {
          return departureTime; 
        } else if (currentIndex === -1){
            
            let prev = routeDescription[routeDescription.length - 1]
            if (prev[0] === 'bus') {
                return provideWalkTime(prev[7], prev[8]);
            } else {
                return provideWalkTime(prev[7], lastAddedTime);
            }   
        } 
        else
        {
          prev = routeDescription[currentIndex - 1];

          return provideWalkTime(prev[7], prev[8]);
        }
      }

    //   else if (currentIndex === routeDescription.length - 1) {
    //     // console.log("it's the last one!!")
    //     // console.log("the one before", routeDescription[currentIndex -1])
    //     } 

      function splitDistanceText(distText) {
        let arr = distText.split(",");
        return arr[0];
      }

      splitDistanceText(routeSection[5]);

      finString += `
          <div class="more-route-info__locationDiv ${
            routeSection[0] == "bus" ? "busLocationDiv" : ""
          }">
          `;

      //   add time section =========

      finString += `<div class="more-route-info__individualTime"> 
            
            <h2>${
              routeSection[0] === "bus" ? routeSection[8] : provideTime(index)
            }</h2>`;

            console.log("r1:", routeSection[0], "r8", routeSection[8])

      finString += "</div>";

      //   end of time section =========

      //   * ADD WALKING OR BUS ICON
      if (routeSection[0] == "walking") {
        icon = `<ion-icon class="more-route-info__icon__internal" name="walk"></ion-icon>`;
        travelText = "Walk";
      } else {
        icon = `<ion-icon class="more-route-info__icon__internal" name="bus"></ion-icon>`;
        travelText = `${routeSection[1]}`;
      }

      //   add icon
      finString += '<div class="more-route-info__icon">' + icon + "</div>";

      finString += `
         <div class="more-route-info__locationText">
          ${
            index === 0
              ? `<h2>${splitDistanceText(routeSection[5])}</h2>`
              : routeSection[0] === "bus"
              ? `<h2>${splitDistanceText(routeSection[3])}</h2>`
              : `<h2>${splitDistanceText(routeDescription[index - 1][4])}`
          }
         </div>
         <div class="more-route-info__distanceText">
             <h2><span class="type-span">${travelText}</span> (${
        routeSection[7]
      })</h2>
         </div>
         ${
           index === routeDescription.length - 1
             ? `<div class='more-route-info__finalCircle'></div>
            <div class="more-route-info__finalText"><h2>${splitDistanceText(
              routeSection[6]
            )}</h2></div>
            <div class="more-route-info__individualTime finalTime">
             <h2>${provideTime(-1)}</h2>
          </div>
            `
             : ``
         }
          </div>
          
          `;
    });
    console.log("LAST ADDED TIMNE!!!", lastAddedTime)
    return finString;
  }

  static jpDisplayCard(innerText, id) {
    return `<div class="journey-planner__routes__card routeCard" id="route-${id}">
       <div class="customCard">
          ${innerText}
       </div>
        </div>`;
  }

  static buildRouteDescription(routeDescription) {}

  static journeyShowCard(routeDescription, innerText, id) {
    return `<div class="journey-planner__routes__card routeCard showCard" id="route-${id}">
    
    <div class="showCard__toggleButtonsContainer">
                    <div class="showCard__backToRoutesContainer" id="backToRoutes">
                      <ion-icon
                        name="md-arrow-back"
                        class="showCard__backArrow"
                      ></ion-icon>
                      <h2 class="showCard__routeText showText">Choose another route</h2>
                    </div>
                    <div class="showCard__moreInfoContainer" id="moreInfo-click">
                      <ion-icon
                        name="arrow-dropup-circle"
                        class="showCard__moreInfoButton"
                      ></ion-icon>
                      <h2 class="showCard__infoText showText" id="infoText">More Info</h2>
                    </div>
                  </div>
       ${innerText}
       <div class="more-route-info">
           
       ${Route.moreInfoBuilder(routeDescription)}
           
       </div>
    </div>
     </div>`;
  }
}

export const search = {
  searchButton,
  searchContainer,
  searchInput
};

//   route.showContainer.innerHTML = Route.journeyShowCard(
//     route.routeData.routeDescription,
//     route.nodeHTML,
//     route.routeData.id
//   );
//   route.showContainer.style.display = "block";
//   go to lowered state
//   bottomSwiper.changeState(bottomSwiper.LOWERED_STATE, null);

