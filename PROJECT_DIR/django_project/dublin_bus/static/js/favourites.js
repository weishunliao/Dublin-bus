const mySwiper = new Swiper('.swiper-container', {
    loop: true,
    observer: true,
    observeParents: true,
});

const stop_col = document.querySelector(".favourites__head__subtitle__col1");
const route_col = document.querySelector(".favourites__head__subtitle__col2");
const journey_col = document.querySelector(".favourites__head__subtitle__col3");
const cols = [stop_col, route_col, journey_col];

for (let i = 0; i < cols.length; i++) {
    cols[i].addEventListener('click', () => {
        mySwiper.slideToLoop(i, 300, true);
    });
}
mySwiper.on('slideChange', function () {
    for (let i = 0; i < cols.length; i++) {
        if (mySwiper.realIndex === i) {
            cols[i].style.borderBottomColor = '#3D5F7E';
        } else {
            cols[i].style.borderBottomColor = 'transparent';
        }
    }
});
