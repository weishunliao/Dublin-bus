const topDrawer = document.querySelector('.drawer__container--top');
const bottomDrawer = document.querySelector('.drawer__container--bottom');
const searchButton = document.querySelector('.search-button');
const searchContainer = document.querySelector('.search-container');
const searchInput = document.querySelector('.search-input');

export let selectedTab = $('ion-tab-button#tab-button-journey');
export const jpFormInputs = $('.journey-planner__form__input');
export const fromInput = document.querySelector("#from");
export const toInput = document.querySelector("#to");
export const sightInput = document.querySelector("#search-sightseeing");

export const drawers = {
    top: topDrawer,
    bottom: bottomDrawer
};

export const search = {
    searchButton,
    searchContainer,
    searchInput
};


    


