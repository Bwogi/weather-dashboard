<<<<<<< HEAD
var formEl = document.getElementById("form"); 
var theCityEl = document.getElementById("theCity"); 
var historyContainerEl =document.querySelector("#historyContainer"); 
var theForecastEl =document.querySelector("#theForecast"); 
var currentCityEl =document.querySelector("#currentCity");
var currentCityStored;    
var weatherIconImageEl =document.querySelector("#weatherIcon");
var currentCityHumidityEl= document.querySelector("#currentCityHumidity"); 
var currentCityTemperatureEl = document.querySelector("#currentCityTemperature"); 
var currentCityWindEl = document.querySelector("#currentCityWind");
var currentCityUVIndexEl = document.querySelector("#currentCityUVIndex");
var MY_API_KEY = "2d709df5b1075660c37a20358ca6ab57"; 
var cityLocalStore = JSON.parse(localStorage.getItem("city")) ||[];
var theArrayDay=[]; 
=======
var formEl = document.getElementById('form');
// console.log(formEl)
var historyContainerEl = document.querySelector('.history');
var cityInputEl = document.getElementById('city');
var fiveDayForecastEl = document.getElementById('five-day-forecast');

>>>>>>> 63bd455cc4a0e4a0fdb5bd8503231e144974e92b


//uvIndex colours
var colorcodeUV = function(UVIndex){
    UVIndex= parseFloat(UVIndex);
    if (UVIndex >= 0 && UVIndex <=2) {currentCityUVIndexEl.classList.add("bg-success", "text-white");}
    else if(UVIndex >= 3 && UVIndex <= 5){currentCityUVIndexEl.classList.add("bg-warning", "text-white");}
    else if(UVIndex >= 6 && UVIndex <= 7){currentCityUVIndexEl.classList.add("bg-info", "text-white");}
    else if (UVIndex >= 8 && UVIndex <= 10){currentCityUVIndexEl.classList.add("bg-danger", "text-white");}
    else { currentCityUVIndexEl.classList.add("bg-secondary", "text-white");}
}
var getUVIndex = function (lati, long){
    const uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lati+"&lon="+long+"&exclude=hourly,daily&units=imperial&appid=MY_API_KEY"
    fetch(uvURL)
    .then(function(response) {
    if(response.ok){
        response.json().then(function(data) {
            
            var uvTitleEl = document.querySelector("#uv-title");
            uvTitleEl.innerHTML="UV-index :"
            uvindexEl.innerHTML = data.current.uvi; 
            uvTitleEl.appendChild(uvindexEl);
            var uvnumber = parseInt(data.current.uvi) ;
            colorcodeUV(uvnumber);            
        });
    }
     })  
     .catch(function(error) {
        alert("API connection issue!");
      }) ;
}


var formatDate =function(theArrayDay) {
  
    if (theArrayDay.length ==0){       
        alert("Empty list !! ");   
        }
  
    else{
            for (i = 1; i < theArrayDay.length; i++) 
            {
                const milliSecs = theArrayDay[i]*1000
                const dateObj = new Date(milliSecs);
                const normalDateFormat = dateObj.toLocaleDateString();
                theArrayDay[i]  =normalDateFormat;
            }
        }
    return;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
// Five day forecast
var fiveDayForecast =function (data){
    var iconURL;
    for(let i= 1; i< data.cnt; i++){
        console.log(data);
        
        theArrayDay[i] =data.list[i].dt;
    }  
    formatDate(theArrayDay); 
    
    theForecastEl.classList.remove("hide"); 
    for (i =1;i<data.cnt;i++){
     var dayContainer =document.querySelector("#day-"+i);
     var dateEl = document.querySelector("#date"+i);
     
     dateEl.innerHTML=theArrayDay[i];
     dayContainer.appendChild(dateEl);
     var imgEl =document.querySelector("#img"+i);
     iconURL = "https://openweathermap.org/img/wn/"+data.list[i].weather[0].icon+".png"
     imgEl.setAttribute("src",iconURL);
     dayContainer.appendChild(imgEl);
     var temperEl = document.querySelector("#temp"+i);
     temperEl.innerHTML= "Temperature: "+ data.list[i].temp.max + "°F";
     dayContainer.appendChild(temperEl);
     var humEl = document.querySelector("#hum"+i);
     humEl.innerHTML ="Humdity: "+data.list[i].humidity + "%";
     dayContainer.appendChild(humEl);
    var winEl =document.querySelector("#wind"+i);
    winEl.innerHTML= "Wind: "+ data.list[i].speed +"MPH";
    dayContainer.appendChild(winEl);
    
    }
}
var getfiveDayForecast =function(lati,long){
    const fiveDayURL ="https://api.openweathermap.org/data/2.5/forecast/daily?lat="+lati+"&lon="+long+"&cnt=6&units=imperial&appid=6acd9728daeb3f35f10da98fa3f7eb4b";
    console.log(fiveDayURL);
    fetch(fiveDayURL)
    .then(function(response) {
        if(response.ok){
         response.json().then(function(data) {
                fiveDayForecast(data); 
            });
        }
        else {
        alert('City Not found! For cities having two words please enter spaces between,Ex: Newyork - New York');
        return;
            }  
    })
    .catch(function(error) {
        alert("Unable to connect to Weathermap");
      });
}

var displayCityWeather= function(currentCityStored, data) 
{
    if (data.length === 0) {
        currentCityEl.textContent = "Could not obtain weather-data.";
        return;
    } 
    var thisDate = data.dt;
    thisDate = thisDate*1000;
    const cityDateObj = new Date(thisDate);
    thisDate = cityDateObj.toLocaleDateString();
   

   
    var chosenCityTitle=toTitleCase(currentCityStored);
    weatherIconURL = "https://openweathermap.org/img/wn/"+data.weather[0].icon+".png"

    var timeOffset =data.timezone;
    timeOffset = (timeOffset)/(1000*60) ;
     var m = cityDateObj.toLocaleString("en-US", {timeZoneName: "short"})
    
    
    var cityLat = data.coord.lat;
    var cityLon = data.coord.lon;

    getUVIndex(cityLat,cityLon); 
    
    currentCityTemperatureEl.innerHTML ="Temperature  : "+data.main.temp+"°F";
    currentCityHumidityEl.innerHTML ="Humidity : "+data.main.humidity +"%";
    currentCityWindEl.innerHTML ="Wind : "+ data.wind.speed +"MPH"; 

    weatherIconImageEl.setAttribute("src",weatherIconURL);
    currentCityEl.innerHTML =chosenCityTitle+" "+thisDate;
    currentCityEl.append(weatherIconImageEl); 

    document.getElementById("forecast-container").classList.remove("hide");
    getfiveDayForecast(cityLat,cityLon);
    
};

function handleErrors(res) {
   
  }
var getWeatherInfo =function(city){
  
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=2d709df5b1075660c37a20358ca6ab57";
    fetch (apiUrl)
    .then(function(response) {
        if(response.ok){
         response.json().then(function(data) {
                displayCityWeather(city,data)
                saveInLocalStorage(currentCityStored);
            });    
        }
     else {
       alert('City Not found!: For cities having two words please enter spaces between,Ex: Newyork - New York');

        document.location.replace("./index.html");

    } 
 })  
  .catch(function(error) {
   alert("Unable to provide data");  
 });

 }
// history
var displayButtons = function()
{
    var citArr= cityLocalStore;

    while(historyContainerEl.lastChild != null) {
    historyContainerEl.removeChild(historyContainerEl.lastChild);
    }  

    if(citArr != null) {
    for ( let i=0;i<citArr.length; i++){
         var buttonEl = document.createElement("button");
            buttonEl.className ="btn btn-light";
        buttonEl.innerHTML =citArr[i] ;
        historyContainerEl.appendChild(buttonEl);
     }
     if(citArr.length)
        document.querySelector("#history").classList.remove("hide");   
    }

}
var saveInLocalStorage =function(city){
    if (cityLocalStore.length >=5) cityLocalStore.shift(); 
    cityLocalStore = [...new Set(cityLocalStore)]; 
    localStorage.setItem("city",JSON.stringify(cityLocalStore));  
    displayButtons();   
}
var formSubmitHandler = function(event) {
    
    event.preventDefault(); 
    currentCityStored = theCityEl.value.trim();
    currentCityStored.toLowerCase();
    if (currentCityStored) {    
        getWeatherInfo(currentCityStored) ;
        theCityEl.value = ""; 
      } else {
        alert("Please enter a city name");
      }
  };
formEl.addEventListener("submit",formSubmitHandler); 

var buttonClickHandler =function (event){
    event.preventDefault();
    event.target.getAttribute("innerHTML");
    let i= 0;
    while (i<cityLocalStore.length){
    if (event.target.innerHTML === cityLocalStore[i]) 
       { var cityClicked = cityLocalStore[i] ;
        getWeatherInfo(cityClicked); 
        break;   
      }
      i++;
    }
};
historyContainerEl.addEventListener("click", buttonClickHandler);   
