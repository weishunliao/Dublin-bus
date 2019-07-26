import { initMap } from "./google_maps";

import { selectedTab } from "./nodes";

export let bottomSwiper;
window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// ^ Check for pointer events support...

var pointerDownName = "pointerdown";
var pointerUpName = "pointerup";
var pointerMoveName = "pointermove";

if (window.navigator.msPointerEnabled) {
  pointerDownName = "MSPointerDown";
  pointerUpName = "MSPointerUp";
  pointerMoveName = "MSPointerMove";
}

// Simple way to check if some form of pointerevents is enabled or not
window.PointerEventsSupport = false;

class Swiper {
  constructor(element) {
    this.element = element;
    this.IN_STATE = 1;
    this.OUT_STATE = 2;
    this.differenceInY = 0;
    this.rafPending = false;
    //   * where the touch happens
    this.initialTouchPos = null;
    // * where the last touch happened
    this.lastTouchPos = null;
    this.open = true;
    this.scrollThreshold;
    this.itemHeight = element.offsetHeight;
    this.tabs = $('ion-tab-button')
    this.map = $('#map')
    this.inTransformVal = element.offsetHeight * 1;
    this.outTransformVal = element.offsetHeight * 0.08;
    this.startTransform = this.inTransformVal;

    //   * where the bottom of the div is currently located
    // * the transform value is -(500 - currentYPosition)

    this.currentState = this.IN_STATE;

    // Perform client width here as this can be expensive and doens't
    // change until window.onresize

    // *   the height of the div
    this.slopValue = this.itemHeight * (1 / 6);

    this.handleGestureStart = this.handleGestureStart.bind(this);
    this.handleGestureMove = this.handleGestureMove.bind(this);
    this.handleGestureEnd = this.handleGestureEnd.bind(this);
    this.updateSwipeRestPosition = this.updateSwipeRestPosition.bind(this);
    this.changeState = this.changeState.bind(this);
    this.getGesturePointFromEvent = this.getGesturePointFromEvent.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.onAnimFrame = this.onAnimFrame.bind(this);
    this.addListeners();
  }

  handleGestureStart(evt) {
    // evt.preventDefault()
    if (evt.touches && evt.touches.length > 1) {
      return;
    }

    document.addEventListener("mousemove", this.handleGestureMove, true);
    document.addEventListener("mouseup", this.handleGestureEnd, true);

    this.initialTouchPos = this.getGesturePointFromEvent(evt);
    this.element.style.transition = "initial";
  }

  handleGestureMove(evt) {
    evt.preventDefault();

    if (!this.initialTouchPos) {
      return;
    }

    this.lastTouchPos = this.getGesturePointFromEvent(evt);

    if (this.rafPending) {
      return;
    }

    this.rafPending = true;

    window.requestAnimFrame(this.onAnimFrame);
  }

  handleGestureEnd(evt) {
    if (evt.touches && evt.touches.length > 0) {
      return;
    }

    this.rafPending = false;

    document.removeEventListener("mousemove", this.handleGestureMove, true);
    document.removeEventListener("mouseup", this.handleGestureEnd, true);

    this.updateSwipeRestPosition();

    this.initialTouchPos = null;
    this.lastTouchPos = null;
  }

  updateSwipeRestPosition() {
    let differenceInY = this.initialTouchPos.y - this.lastTouchPos.y;
    let currentTransform = this.startTransform - differenceInY;
    let newState = this.currentState;
    let n = null;

    if (Math.abs(differenceInY) > this.slopValue) {
      if (this.currentState === this.IN_STATE) {
        if (differenceInY < 0) {
          newState = this.IN_STATE;
        } else {
          newState = this.OUT_STATE;
        }
      } else {
        if (this.currentState === this.OUT_STATE && differenceInY < 0) {
          newState = this.IN_STATE;
      
        } else if (this.currentState === this.OUT_STATE && differenceInY > 0) {
          newState = this.OUT_STATE;
        }
      }
    } else {
      newState = this.currentState;
    }

    this.element.style.transition = "all 150ms ease-out";
    this.changeState(newState, n);
  }

  changeState(newState, selectedTab) {

    console.log("change state called");
    if (selectedTab !== null) {
    } else {
      console.log("it's null");
    }
    let transformStyle;
    switch (newState) {
      case this.IN_STATE:
        this.startTransform = this.inTransformVal;
        console.log(this.tabs)
        this.tabs.addClass('color-add')
        this.map.removeClass('drawer-open')

        break;
      case this.OUT_STATE:
        this.startTransform = this.outTransformVal;
        this.tabs.removeClass('color-add')
        this.map.addClass('drawer-open')
        break;
    }

    this.transformStyle =
      "translateY(" + this.startTransform + "px) translateX(-50%)";

    this.element.style.msTransform = this.transformStyle;
    this.element.style.MozTransform = this.transformStyle;
    this.element.style.webkitTransform = this.transformStyle;
    this.element.style.transform = this.transformStyle;

    this.currentState = newState;
  }

  getGesturePointFromEvent(evt) {
    var point = {};

    if (evt.targetTouches) {
      point.x = evt.targetTouches[0].clientX;
      point.y = evt.targetTouches[0].clientY;
    } else {
      // Either Mouse event or Pointer Event
      point.x = evt.clientX;
      point.y = evt.clientY;
    }

    return point;
  }

  onAnimFrame() {
    if (!this.rafPending) {
      return;
    }

    let differenceInY = this.initialTouchPos.y - this.lastTouchPos.y;

    let newYTransform = this.startTransform - differenceInY;

    let transformStyle;

    if (newYTransform > 5 && newYTransform < this.inTransformVal + 3) {
      transformStyle = `translateY(${newYTransform}px) translateX(-50%)`;
    }

    this.element.style.webkitTransform = transformStyle;
    this.element.style.MozTransform = transformStyle;
    this.element.style.msTransform = transformStyle;
    this.element.style.webkitTransform = transformStyle;
    this.element.style.transform = transformStyle;

    this.rafPending = false;
  }

  addListeners() {
    this.element.addEventListener("touchstart", this.handleGestureStart, false);
    this.element.addEventListener("touchmove", this.handleGestureMove, false);
    this.element.addEventListener("touchend", this.handleGestureEnd, false);
    this.element.addEventListener("touchcancel", this.handleGestureEnd, false);

    // Add Mouse Listener
    this.element.addEventListener("mousedown", this.handleGestureStart, false);
  }
  //   }
}

window.addEventListener("load", function() {
  bottomSwiper;
  var h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  $('.drawer__container').css('height', h * 0.95);

  const main = document.querySelector(".main");

  window.onresize = function() {
    main.setAttribute("style", `height:${h}px`);
  };

  Swiper.underline = document.querySelector(".jp__header__underline");

  window.onresize();

  const bottomDrawer = document.querySelector(".drawer__container--bottom");
  let currentTab;
  const wrapper = document.querySelector(".drawer__jp__wrapper");
  let tabs = document.querySelector(".tabs");

  const ionTabBar = document.querySelector("ion-tab-bar");

  const ionTabs = document.querySelector("ion-tabs");

  function handleOut(e) {
    if (bottomSwiper.currentState === bottomSwiper.IN_STATE) {
      bottomSwiper.changeState(bottomSwiper.OUT_STATE, null);
    }
  }

  function tabClick(e) {
    

    console.log(e.target.id);

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
    bottomSwiper = new Swiper(bottomDrawer);
    tabs.addEventListener("ionTabsWillChange", handleOut);
  }, 200);

  const tab_buttons = document.querySelectorAll("ion-tab-button");
  //   console.log(tab_buttons)
  tab_buttons.forEach(tab => {
    tab.addEventListener("click", tabClick, true);
  });

  const map = document.querySelector(".map__container");
  const searchInput = document.querySelector(".drawer__search__input");


  $('.journey-planner__routes__scroll-area').click((e)=>{
      e.stopPropagation();
      
  })
});
