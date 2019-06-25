function initMap() {
    // The location of Uluru
    var uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: uluru,
      disableDefaultUI: true
    });
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({ position: uluru, map: map });

  
}

window.initMap = initMap;


const script = document.createElement('script')
script.async = true
script.defer = true
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHOm3cpWxFMVCHVlJE51oV9xZhERWweGQ&callback=initMap"
document.head.appendChild(script)


