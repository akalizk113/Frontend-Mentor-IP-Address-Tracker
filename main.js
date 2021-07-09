const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const btn = $('.btn');
const formMessage = $('.form-message');
const ipAddressElement = $('.info-ipAddress .info__desc');
const locationElement = $('.info-location .info__desc');
const timeZoneElement = $('.info-timeZone .info__desc');
const ispElement = $('.info-isp .info__desc');

const apiUrl = 'https://geo.ipify.org/api/v1';
const apiKey = `at_5LEyYj8R503cQSZX2Cf3J5F5RqKw5`;


let ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
let domainRegex = /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/;




// Validator Function
const validator = () => {

   $('.form').onsubmit = e => {
      e.preventDefault();
   }
   btn.onclick = () => {
      const errorMessage = validate($('.input-form').value);
      if (errorMessage) {
         formMessage.innerHTML = errorMessage;
      } else {
         mappings();
      }
   }

   $('.input-form').oninput = () => {
      formMessage.innerHTML = ``;
   }

}

const validate = (value) => {
   return ipRegex.test(value) || domainRegex.test(value) ? undefined : `IP Address / domain invalid`
}

const mappings = async () => {
   const value = $('.input-form').value;
   let url;
   if (ipRegex.test(value)) {
      url = `${apiUrl}?apiKey=${apiKey}&ipAddress=${value}`;
   } else if (domainRegex.test(value)) {
      url = `${apiUrl}?apiKey=${apiKey}&domain=${value}`
   }
   await fetch(url)
      .then(response => response.json())
      .then(data => {
         ipAddressElement.innerHTML = data.ip;
         locationElement.innerHTML = `${data.location.city}, ${data.location.region}`;
         timeZoneElement.innerHTML = `UTC${data.location.timezone}`;
         ispElement.innerHTML = data.isp;

         return [
            data.location.lat,
            data.location.lng
         ]
      })
      .then(coordinates => {
         $('.map-container').innerHTML = `<div id="mapid"></div>`
         var map = new L.map('mapid');
         map.setView(coordinates, 15);
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         }).addTo(map);

         L.marker(coordinates).addTo(map)
            .bindPopup(`${ipAddressElement.innerHTML}`)
            .openPopup();

      })
      .catch(err => {
         console.log(err);
      })
}


function app() {
   validator();
}

app();