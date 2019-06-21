import '../css/main.scss'



const menuCtrl = document.querySelector('ion-menu-controller');

const starter = document.querySelector('#starter')

starter.addEventListener('click', openFirst)
 
function openFirst() {
    menuCtrl.enable(true, 'first');
    menuCtrl.open('first');
  }
  
  function openEnd() {
    menuCtrl.open('end');
  }
  
  function openCustom() {
    menuCtrl.enable(true, 'custom');
    menuCtrl.open('custom');
  }


