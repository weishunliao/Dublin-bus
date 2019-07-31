import { jpFormInputs, fromInput, toInput, dateInput, dateContainer } from './nodes'





jpFormInputs.focus((e) => {
    $(`#${e.target.id}-container`).addClass('focussed');
})


jpFormInputs.blur((e) => {
    if (e.target.value == "") {
        $(`#${e.target.id}-container`).removeClass('focussed');
    }
})


dateInput.addEventListener('ionChange', (e) => {
   dateContainer.classList.add('focussed');
})

dateInput.addEventListener('ionCancel', (e) => {
    if (e.target.value === ""){
        dateContainer.classList.remove('focussed')
    }
})



// ^ switch Button

const switcher = $('.img-button')

switcher.click(() => {
    let temp = toInput.value;
    toInput.value = fromInput.value
    fromInput.value = temp
})

