import { jpFormInputs } from './nodes'



const dateInput = document.querySelector('ion-datetime')

jpFormInputs.focus((e) => {
    $(`#${e.target.id}-container`).addClass('focussed');
})

jpFormInputs.blur((e) => {
    if (e.target.value == "") {
        $(`#${e.target.id}-container`).removeClass('focussed');
    }
})

dateInput.addEventListener('ionFocus', (e) => {
    $(`#${e.target.id}-container`).addClass('focussed');
})




