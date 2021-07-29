// APIs
const api_url_id = 'https://api.wheretheiss.at/v1/satellites/25544';
const api_url_name = 'http://api.open-notify.org/astros.json';

//CONFIGURAÇÃO DO MAPA
const mymap = L.map('mapBg').setView([0, 0], 2);
// const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl = 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';

const ISSIcon = L.icon({
    iconUrl: "imagens/ISS.svg",
    iconSize: [62, 40],
    iconAnchor: [25, 36],
});
const marker =  L.marker([0, 0], {icon: ISSIcon}).addTo(mymap);

// Copyright
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tiles = L.tileLayer(tileUrl, { attribution });

tiles.addTo(mymap);


// GET API [Wheretheiss]
let center = true;
async function getISS() {
    const response = await fetch(api_url_id);
    const data = await response.json();
    const {
        name,
        altitude,
        latitude,
        longitude,
        velocity,
        visibility,
        timestamp
    } = data

    // Set Marker
    marker.setLatLng([latitude, longitude]);
    if(center){
        if(window.innerWidth > 600){
            mymap.setView([latitude, longitude], 3);
            center = false;
        }else{
            mymap.setView([latitude, longitude], 1);
            center = false;
        }
    }
   
    // Passando a telemetria para HTML
    var time =  new Date(timestamp * 1000);

    document.getElementById('name').textContent = name;
    document.getElementById('latitude').textContent = latitude;
    document.getElementById('longitude').textContent = longitude;
    document.getElementById('altitude').textContent = altitude.toFixed(2) + " km";
    document.getElementById('velocidade').textContent = velocity.toFixed(2) + " km/h";
    // document.getElementById('timestamp').textContent =  time.toISOString();
    document.getElementById('timestamp').textContent =  
        time.getUTCDate() + "/" +
        time.getUTCMonth() + "/" +
        time.getUTCFullYear() + " " +
        time.getUTCHours() + ":" +
        time.getUTCMinutes() + ":" +
        time.getUTCSeconds()
    ;

    if(visibility === "daylight"){
        document.getElementById('visibility').textContent = "Dia"
    }else{
        document.getElementById('visibility').textContent = "Noite"
    }

    if(document.getElementById('checkbox').checked){
        center = true
    }
    getPeople();
}

// GET API [open-notify]
async function getPeople(){
    const response = await fetch(api_url_name);
    const people = await response.json();

    let list = people.people;

    document.getElementById('pessoas').textContent = list.filter(x=> x.craft == "ISS").length;
}

getISS();
setInterval(getISS, 2000);
