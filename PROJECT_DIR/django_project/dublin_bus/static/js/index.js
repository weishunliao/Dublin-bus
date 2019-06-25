import "../css/main.scss";
import "./google_maps";
import buildWeather from "./skycons.js"
import { nodes } from "./nodes";

console.log(nodes.drawers);

function handleDrawers(classList) {
  const classes = [...classList];
  if (classes.includes("drawer__container--top")) {
    nodes.drawers.bottom.classList.remove("open");
    nodes.drawers.top.classList.toggle("open");
    nodes.underline.classList.toggle("open");
  } else if (classes.includes("drawer__container--bottom")) {
    nodes.drawers.top.classList.remove("open");
    nodes.drawers.bottom.classList.toggle("open");
  }
}



buildWeather(icon)




const drawersArr = Object.values(nodes.drawers);

drawersArr.forEach(el => {
  el.addEventListener("click", () => {
    handleDrawers(el.classList);

  });
});

// var mySwiper = new Swiper ('.swiper-container', {
//     // Optional parameters
//     direction: 'vertical',
//     loop: true,

//     // If we need pagination
//     pagination: {
//       el: '.swiper-pagination',
//     },

//     // Navigation arrows
//     navigation: {
//       nextEl: '.swiper-button-next',
//       prevEl: '.swiper-button-prev',
//     },

//     // And if we need scrollbar
//     scrollbar: {
//       el: '.swiper-scrollbar',
//     },
//   })
