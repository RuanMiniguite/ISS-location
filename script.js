//Loader
const overlay = document.querySelector(".overlay")

window?.addEventListener("load", function () {
    overlay.style.display = "none"
});

// APIs
const api_url_id = 'https://api.wheretheiss.at/v1/satellites/25544'
const api_url_name = 'http://api.open-notify.org/astros.json'

// Config map
const mymap = L.map('mapBg').setView([0, 0], 2)
//const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';     
//const tileUrl = 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
const tileUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'

const ISSIcon = L.icon({
    iconUrl: "imagens/ISS.svg",
    iconSize: [62, 40],
    // iconAnchor: [25, 36],
});

const marker =  L.marker([0, 0], {icon: ISSIcon}).addTo(mymap)

const circle = L.circle({lat: 0, lng: 0}, {
    color: '#00ffff',
    fillColor:'#00ffff',
    fillOpacity: 0,
    weight: 2,
    radius: 800000,
    opacity: 0.5,
}).addTo(mymap)

// Copyright
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const tiles = L.tileLayer(tileUrl, { attribution })

mymap.zoomControl.remove()
tiles.addTo(mymap)
option();


// GET API [Wheretheiss]
let center = true
async function getISS() {
    const response = await fetch(api_url_id)
    const data = await response.json()
    const {
        name,
        altitude,
        latitude,
        longitude,
        velocity,
        visibility,
        timestamp
    } = data

    marker.setLatLng([latitude, longitude])
    circle.setLatLng([latitude, longitude])

    if(center){
        if(window.innerWidth > 1500){
            mymap.setView([latitude, longitude], 3)
            center = false
        }else if(window.innerWidth > 1000){
            mymap.setView([latitude, longitude + 40], 3)
            center = false
        }else if(window.innerWidth > 550){
            mymap.setView([latitude, longitude], 3)
            center = false
            document.getElementById('tele').checked = true
            tele()
        } else{
            mymap.setView([latitude, longitude], 2)
            center = false
            document.getElementById('live1').style.visibility="visible"
            document.getElementById('live2').style.visibility="visible"
        }
    }
   
    var time =  new Date(timestamp * 1000)
    var target_date = new Date("january 01, 2031").getTime();
    var dias, horas, minutos, segundos;

    var current_date = new Date().getTime();
    var segundos_f = (target_date - current_date) / 1000;

    dias = parseInt(segundos_f / 86400);
    segundos_f = segundos_f % 86400;
    
    horas = parseInt(segundos_f / 3600);
    segundos_f = segundos_f % 3600;
    
    minutos = parseInt(segundos_f / 60);
    segundos = parseInt(segundos_f % 60);

    document.getElementById('name').textContent = name
    document.getElementById('latitude').textContent = latitude + "°"
    document.getElementById('longitude').textContent = longitude + "°"
    document.getElementById('altitude').textContent = altitude.toFixed(2) + " km"
    document.getElementById('velocidade').textContent = velocity.toFixed(2) + " km/h"
    document.getElementById('timestamp').textContent =  
        time.getUTCDate() + "/" +
        (time.getUTCMonth() + 1) + "/" +
        time.getUTCFullYear() + " " +
        time.getUTCHours() + ":" +
        time.getUTCMinutes() + ":" +
        time.getUTCSeconds() + " UTC"

    document.getElementById('Tdesorbita').textContent = "T- " + dias  + " D | " + horas + ":" + minutos + ":" + segundos

    visib(visibility);
    aligh();
}

getISS()
setInterval(getISS, 2000)

function visib(visibility){
    if(visibility === "daylight"){
        document.getElementById('visibility').textContent = "Dia"
    }else{
        document.getElementById('visibility').textContent = "Noite"
    }
}

function live(){
    if(document.getElementById('ibm').checked){
        option();
    }else{
        document.getElementById('live1').style.visibility="hidden"
        document.getElementById('live2').style.visibility="hidden"
    }
}

function option(){
    if(document.getElementById('optionLive').checked){
        document.getElementById('live1').style.visibility="visible"
        document.getElementById('live2').style.visibility="hidden"
    }else{
        document.getElementById('live1').style.visibility="hidden"
        document.getElementById('live2').style.visibility="visible"
    }
}

function aligh(){
    if(document.getElementById('checkbox').checked){
        center = true
    }
}

function tele(){
    if(document.getElementById('tele').checked){
        document.getElementById('info').style.visibility="visible"
    }else{
        document.getElementById('info').style.visibility="hidden"
    }   
}