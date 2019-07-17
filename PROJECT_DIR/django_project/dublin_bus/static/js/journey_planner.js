const fromInput = $("")


const inputs = $('.journey-planner__form__input')
const dateInput = document.querySelector('ion-datetime')

inputs.focus((e) => {
    $(`#${e.target.id}-container`).addClass('focussed');
})

dateInput.addEventListener('ionFocus', (e) => {
    $(`#${e.target.id}-container`).addClass('focussed');
})

inputs.blur((e) => {
    if (e.target.value == "") {
        $(`#${e.target.id}-container`).removeClass('focussed');
    }
   
})


