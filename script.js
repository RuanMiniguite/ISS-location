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

mymap.zoomControl.remove();
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
        if(window.innerWidth > 1100){
            mymap.setView([latitude, longitude], 3);
            center = false;
        }else if(window.innerWidth > 550){
            mymap.setView([latitude, longitude], 3);
            center = false;
            document.getElementById('tele').checked = true;
            tele();
        } else{
            mymap.setView([latitude, longitude], 2);
            center = false;
            document.getElementById('ibm').checked = true;
            live()
        }
    }
   
    // Passando a telemetria para HTML
    var time =  new Date(timestamp * 1000);

    document.getElementById('name').textContent = name;
    document.getElementById('latitude').textContent = latitude.toFixed(2);
    document.getElementById('longitude').textContent = longitude.toFixed(2);
    document.getElementById('altitude').textContent = altitude.toFixed(2) + " km";
    document.getElementById('velocidade').textContent = velocity.toFixed(2) + " km/h";
    // document.getElementById('timestamp').textContent =  time.toISOString();
    document.getElementById('timestamp').textContent =  
        time.getUTCDate() + "/" +
        time.getUTCMonth() + "/" +
        time.getUTCFullYear() + " " +
        time.getUTCHours() + ":" +
        time.getUTCMinutes() + ":" +
        time.getUTCSeconds() + " UTC"
    ;
    visib(visibility);
    aligh();
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

function visib(visibility){
    if(visibility === "daylight"){
        document.getElementById('visibility').textContent = "Dia"
    }else{
        document.getElementById('visibility').textContent = "Noite"
    }
}

function live(){
    if(document.getElementById('ibm').checked){
        document.getElementById('live').style.visibility="visible";
    }else{
        document.getElementById('live').style.visibility="hidden";
    }
}

function aligh(){
    if(document.getElementById('checkbox').checked){
        center = true
    }
}

function tele(){
    if(document.getElementById('tele').checked){
        document.getElementById('info').style.visibility="visible";
    }else{
        document.getElementById('info').style.visibility="hidden";
    }   
}