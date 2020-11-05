const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

const weather={};
weather.temperature ={
    unit: "celsius"
};

//Display on page
function displayWeather(){
    iconElement.innerHTML=`<img src="icons/${weather.iconId}.png" />`;
    tempElement.innerHTML=`${weather.temperature.value}&#176 <span>C</span>`;
    descElement.innerHTML=weather.description;
    locationElement.innerHTML=`${weather.city}, ${weather.country}`;
}


//Temp conversion
function celsiusToFahrenheit(temp){
    return (temp*9/5)+32;
}


//Event listener
tempElement.addEventListener('click',function(){
    if(weather.temperature.value===undefined) return;

    if(weather.temperature.unit==="celsius"){
        let fahrenheit = Math.floor(celsiusToFahrenheit(weather.temperature.value));
        tempElement.innerHTML=`${fahrenheit}&#176 <span>F</span>`;
        weather.temperature.unit="fahrenheit";
    }else{
        tempElement.innerHTML=`${weather.temperature.value}&#176 <span>C</span>`;
        weather.temperature.unit="celsius";
    }
});



//API setup
const kelvin= 273;

const key="a63e780aeb55e8e396942d0eb083a67d";


//Geolocation setup(check if browser support geolocation)
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display="block";
    notificationElement.innerHTML="<p>Browser doesn't support Geolocation.</p>";
}

//users postion setup 
function setPosition(position){
    let latitude= position.coords.latitude;
    let longitude= position.coords.longitude;

    getWeather(latitude,longitude);
}

function showError(error){
    notificationElement.style.display="block";
    notificationElement.innerHTML=`<p>${error.message}</p>`;
}

function getWeather(latitude,longitude){
    let apiURL=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(apiURL)
    .then(function(res){
        let data=res.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value= Math.floor(data.main.temp - kelvin);
        weather.description= data.weather[0].description;
        weather.iconId= data.weather[0].icon;
        weather.city= data.name;
        weather.country =data.sys.country;
    })
    .then(function(){
        displayWeather();
    });
}
