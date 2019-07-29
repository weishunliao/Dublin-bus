
import { selectedTab } from "./nodes";
import Swiper from './Swiper'

export let bottomSwiper;


// Main window load

var h = Math.max(
  document.documentElement.clientHeight,
  window.innerHeight || 0
);
$(".drawer__container").css("height", h * 0.95);

window.addEventListener("load", function() {

  //   assigns the height of the drawer depending on how large the screen is.

  const main = document.querySelector(".main");

  window.onresize = function() {
    main.setAttribute("style", `height:${h}px`);
    $(".drawer__container").css("height", h * 0.95);
    console.log("resized!");
  };

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
    if (e.target.id == "tab-button-journey") {
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
    bottomSwiper = new Swiper(bottomDrawer, grabber);
    tabs.addEventListener("ionTabsWillChange", handleOut);
  }, 200);

  const tab_buttons = document.querySelectorAll("ion-tab-button");
  //   console.log(tab_buttons)
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

  $(".drawer__container").css("display", "block");

  
});

// function preventPullToRefresh(element) {
//   var prevent = false;

//   document.querySelector(element).addEventListener("touchstart", function(e) {
//     if (e.touches.length !== 1) {
//       return;
//     }

//     var scrollY =
//       window.pageYOffset ||
//       document.body.scrollTop ||
//       document.documentElement.scrollTop;
//     prevent = scrollY === 0;
//   });

//   document.querySelector(element).addEventListener("touchmove", function(e) {
//     if (prevent) {
//       prevent = false;
//     }
//   });
// }

// function cancelTouch(element) {
//   document.querySelector(element).addEventListener("touchstart", function(e) {
//     if (e.touches.length !== 1) {
//       return;
//     }
//   });
// }

