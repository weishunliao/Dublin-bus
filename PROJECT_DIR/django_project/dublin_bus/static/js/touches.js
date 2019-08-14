import {
  selectedTab,
  dateInput,
  switchUpText,
  showContainer,
  Route,
  changeCardShowing,
  setTimeToNow
} from "./nodes";

import { showMarkers } from "./google_maps";

import { set_height } from "./stops";

import { checkFavouriteJourneys } from "./favourites";
import Swiper from "./Swiper";
export let ourTabsHeight;
export let bottomSwiper;
export let swiperHeight;

// Main window load

// const ionicScripts = [
//     "https://unpkg.com/@ionic/core@latest/dist/ionic/ionic.esm.js",
//     "https://unpkg.com/@ionic/core@latest/dist/ionic/ionic.js",
// ]
// // const ionicCss = "https://unpkg.com/@ionic/core@latest/css/ionic.bundle.css"

// ionicScripts.forEach(src => {
//     let sc = document.createElement('script')
//     sc.setAttribute("src", src)
//     sc.setAttribute('type', "module");
//     sc.setAttribute('nomodule', "");
//     document.querySelector('head').appendChild(sc)
// })

window.addEventListener("load", function() {
  

  var h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  $(".drawer__container").css("height", h * 0.95);

  const main = document.querySelector(".main");

  window.onresize = function() {
    main.setAttribute("style", `height:${h}px`);
    if (is_mobile_JS) {
      $(".drawer__container").css("height", h * 0.95);
    } else {
      $(".drawer__container").css("height", h);
    }

  };

  setTimeToNow();
  this.document.querySelector('#departing-container').classList.add('focussed');

  Swiper.underline = document.querySelector(".jp__header__underline");

  window.onresize();

  const bottomDrawer = document.querySelector(".drawer__container--bottom");
  let currentTab;
  const wrapper = document.querySelector(".drawer__jp__wrapper");
  let tabs = document.querySelector(".tabs");

  const ionTabBar = document.querySelector("ion-tab-bar");
  const grabber = document.querySelector(".grabber");
  const ionTabs = document.querySelector("ion-tabs");

  function handleOut(e) {
    if (bottomSwiper.currentState === bottomSwiper.IN_STATE) {
      bottomSwiper.changeState(bottomSwiper.OUT_STATE, null);
    }
  }

  function tabClick(e) {
    checkFavouriteJourneys();
    if (
      e.target.id == "tab-button-journey" &&
      bottomSwiper.currentState !== bottomSwiper.OUT_STATE
    ) {
      switchUpText();
      const dateobj = new Date();
      const dateString = dateobj.toISOString();
      
      dateInput.value = dateString;
    }

    if (e.target.id !== "tab-button-journey") {
      changeCardShowing();
      showMarkers();
      Route.returnToRoutes();
      bottomSwiper.jp_active = false;
    }

    if (e.target.id === currentTab) {
      if (bottomSwiper.currentState === bottomSwiper.OUT_STATE) {
        bottomSwiper.changeState(bottomSwiper.IN_STATE, null);
      } else {
        bottomSwiper.changeState(bottomSwiper.OUT_STATE, null);
      }
    } else {
      bottomSwiper.changeState(bottomSwiper.OUT_STATE, null);
    }

    currentTab = e.target.id;
  }

  setTimeout(() => {
    //   SWIPER IS DEFINED
    let bdHeight = Math.max(
      // document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );

    ourTabsHeight = document
      .querySelector(".tabbar-container")
      .getBoundingClientRect().height;

    swiperHeight = document.querySelector('.drawer__container').getBoundingClientRect().height;
      set_height();
    let bdTabs = document
      .querySelector(".tabbar-container")
      .getBoundingClientRect().height;
    bottomDrawer.style.height = bdHeight * 0.95 + "px";

    bottomSwiper = new Swiper(bottomDrawer, grabber, is_mobile_JS);

    tabs.addEventListener("ionTabsWillChange", handleOut);
    $(".load-screen").fadeOut();
  }, 3000);

  const tab_buttons = document.querySelectorAll("ion-tab-button");
  tab_buttons.forEach(tab => {
    tab.addEventListener("click", tabClick, true);
  });

  const map = document.querySelector(".map__container");
  const searchInput = document.querySelector(".drawer__search__input");

  $(".journey-planner__routes__scroll-area").click(e => {
    e.stopPropagation();
  });

  $(".journey-planner__routes-container").on("touchmove", function(e) {
    e.stopPropagation();
  });
  $("#route-descriptions").on("touchmove", function(e) {
    e.stopPropagation();
  });
  $(".favourite-journeys-container").on("touchmove", function(e) {
    e.stopPropagation();
  });
  $("#timeline-wrapper__content__box").on("touchmove", function(e) {
    e.stopPropagation();
  });

  $(".drawer__container").css("display", "block");
});
