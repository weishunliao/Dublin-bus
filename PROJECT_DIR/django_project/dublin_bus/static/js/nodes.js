const topDrawer = document.querySelector('.drawer__container--top');
const bottomDrawer = document.querySelector('.drawer__container--bottom');
const searchButton = document.querySelector('.search-button')
const searchContainer = document.querySelector('.search-container')
const searchInput = document.querySelector('.search-input');

export let selectedTab = $('ion-tab-button#tab-button-journey');
export const jpFormInputs = $('.journey-planner__form__input')
export const fromInput = document.querySelector("#from")
export const toInput = document.querySelector("#to")

export const drawers = {
    top: topDrawer,
    bottom: bottomDrawer
}

import { bottomSwiper } from './touches'

export class Route {
    
    constructor(routeData) {
      this.routeData = routeData;
      this.nodeHTML = this.cardBuilder(routeData.routeDescription, routeData.departureTime, routeData.id)
      this.domNode = null;
      this.showContainer = document.querySelector('#show-container')
    }

    // method for building html

    // method for adding click

    static addClick(route){
       route.domNode.addEventListener('click', () => {

            route.showContainer.innerHTML = route.nodeHTML;
            route.showContainer.style.display = 'block';
            bottomSwiper.changeState(bottomSwiper.IN_STATE, null);
            bottomSwiper.tabs.removeClass("color-add");
       })
    }

    static appendToDom(route){
        $("#routesHere").append(route.nodeHTML);
        route.domNode = document.querySelector(`#route-${route.routeData.id}`)
        Route.addClick(route);
    }


    cardBuilder(routeDescription, departureTime, id) {

       
        // const time = new Date();
        // const time_now = Date.now();
        // console.log(time_now)
        // const givenDate = new Date("Wed, 27 July 2016 13:30:00");
    
      const card = `<div class="journey-planner__routes__card routeCard" id="route-${id}">
      
        <ion-card>
          <ion-card-content>
            <div class="journey-planner__card__container">
              <div class="journey-planner__card__left">
                <div class="journey-planner__card__left__depTitle">
                  <h2
                    class="journey-planner__card__title journey-planner__card__title--departingTitle"
                  >
                    Departing in: 
                  </h2>
                </div>
                <div class="journey-planner__card__left__minsTitle">
                 
                  <span class="journey-planner__card__minuteSpan">5</span>
                  <h1 class="journey-planner__card__timeTitle">mins</h1>
                </div>
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
                      >33</span
                    >
                    minutes
                  </h2>
                </div>
                <div
                  class="journey-planner__card__right__descriptionContainer" id="route-descriptions"
                > 
              
                ${this.iconsBuilder(routeDescription)}
    
                  
                </div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

      </div>`;
        
      return card;
    }


    iconsBuilder(routeDescription) {
        let counter = 0;
        let finString = "";
        routeDescription.forEach(routeSection => {
          let icon;
          let finalArr;
          if (routeSection[0] == "walking") {
            icon = `<ion-icon class="journey-planner__card__icon journey-planner__card__icon--walk" name="walk"></ion-icon>`;
          } else {
            icon = `<ion-icon class="journey-planner__card__icon journey-planner__card__icon--bus" name="bus"></ion-icon>`;
          }
      
          if ((counter + 1) == routeDescription.length) {
            finalArr = "";
          } else {
            finalArr = `<ion-icon class="journey-planner__card__icon journey-planner__card__icon--arrow" name="arrow-forward"></ion-icon>`;
          }
      
          counter++;
      
          finString = finString + `<div class="journey-planner__card__right__iconContainer">
                          ${icon}
                          <div class="journey-planner__card__numberbox journey-planner__card__numberbox">${
                            routeSection[1]
                          }</div>
                          ${finalArr}
                    </div>`;

            
        });
        return finString
  }
}


export const search = {
    searchButton,
    searchContainer,
    searchInput
}


    


