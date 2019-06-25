import '../css/main.scss'


const topDrawer = document.querySelector('.drawer__container--top');
const bottomDrawer = document.querySelector('.drawer__container--bottom');

const drawers = [topDrawer, bottomDrawer];

function handleDrawers(classList) {
    const classes = [...classList]
    if (classes.includes("drawer__container--top")) {
        bottomDrawer.classList.remove('open')
        topDrawer.classList.toggle('open')
    } else if (classes.includes("drawer__container--bottom")){
        topDrawer.classList.remove('open')
        bottomDrawer.classList.toggle('open')
    }
}

drawers.forEach((el) => {
    el.addEventListener('click', () =>{
        handleDrawers(el.classList)
    })
})


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
