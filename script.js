const api_url_id = 'https://api.wheretheiss.at/v1/satellites/25544'
const api_url_name = 'http://api.open-notify.org/astros.json'


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


// async function getGeoLocation(latitude, longitude) {
//     const response2 = await fetch(`https://api.wheretheiss.at/v1/coordinates/${latitude},${longitude}`)
//     const data2 = await response2.json()
//     const {
//         timezone_id,
//         country_code
//     } = data2

//     document.getElementById('timezone_id').textContent = timezone_id 
//     document.getElementById('country_code').textContent = country_code

//     console.log(data2)
// }


async function getPeople(){
    const response = await fetch(api_url_name)
    const people = await response.json()

    let list = people.people

    document.getElementById('pessoas').textContent = list.filter(x=> x.craft == "ISS").length
}