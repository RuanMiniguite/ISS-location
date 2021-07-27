const api_url_id = 'https://api.wheretheiss.at/v1/satellites/25544';
const api_url_name = 'http://api.open-notify.org/astros.json';

const ISSIcon = L.icon({
    iconUrl: "imagens/ISS.svg",
    iconSize: [62, 40],
    iconAnchor: [25, 36],
});


const mymap = L.map('mapBg').setView([0, 0], 2);
const marker =  L.marker([0, 0], {icon: ISSIcon}).addTo(mymap);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl = 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

let center = true;
async function getISS() {
    const response = await fetch(api_url_id);
    const data = await response.json();
    const {
        altitude,
        latitude,
        longitude,
        velocity,
        visibility,
        timestamp
    } = data

    var time =  new Date(timestamp * 1000);

    marker.setLatLng([latitude, longitude]);
 
    if(center){
        mymap.setView([latitude, longitude], 3);
        center = false;
    }
    

    document.getElementById('latitude').textContent = latitude;
    document.getElementById('longitude').textContent = longitude;
    document.getElementById('altitude').textContent = altitude.toFixed(2);
    document.getElementById('velocidade').textContent = velocity.toFixed(2) + " km/h";
    document.getElementById('timestamp').textContent =  time.toLocaleString();
    
    console.log(visibility);
    getPeople();
}

async function getPeople(){
    const response = await fetch(api_url_name);
    const people = await response.json();

    let list = people.people;

    document.getElementById('pessoas').textContent = list.filter(x=> x.craft == "ISS").length;
}

getISS();
function aligh(){
    center = true
}

setInterval(getISS, 1000);
setInterval(aligh, 20000);
    