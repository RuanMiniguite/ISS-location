const api_url_id = 'https://api.wheretheiss.at/v1/satellites/25544';
const api_url_name = 'http://api.open-notify.org/astros.json';


const mymap = L.map('mapBg').setView([51.505, -0.09], 2);
const attrribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attrribution });

tiles.addTo(mymap);


async function getISS() {
    const response = await fetch(api_url_id)
    const data = await response.json()
    const {
        altitude,
        latitude,
        longitude,
        velocity,
        visibility,
        timestamp
    } = data

    var time =  new Date(timestamp * 1000);

    document.getElementById('latitude').textContent = latitude
    document.getElementById('longitude').textContent = longitude
    document.getElementById('altitude').textContent = altitude.toFixed(2)
    document.getElementById('velocidade').textContent = velocity.toFixed(2) + " km/h"
    document.getElementById('timestamp').textContent =  time.toLocaleString();
    
    console.log(visibility)
    getPeople()
}





async function getPeople(){
    const response = await fetch(api_url_name)
    const people = await response.json()

    let list = people.people

    document.getElementById('pessoas').textContent = list.filter(x=> x.craft == "ISS").length
}


