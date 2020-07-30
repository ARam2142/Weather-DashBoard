
$(document).ready(function() {
///////////////////DECLARE VARIABLES WE MIGHT NEED

//variable for city search button
const searchButton = $('#city-search'); 
const inputCity = $('#city-input');

//variables for selected city display
var cityName = $('#city-name'); 
var currentDate = $('#date');
var iconState = $('#iconmain');

var temperatureEl = $('#temperature');
var humidityEl = $('#humidity');
var windSpeedEl = $('#wind-speed');
var uvIndedEl = $('#uv-index');

//variables for the 5 day forcast cards
var tempForcast1 = $('#tempDay1');
var humidityForcast1 = $('#humidity1');
var tempForcast2 = $('#tempDay2');
var humidityForcast12= $('#humidity2');
var tempForcast3 = $('#tempDay3');
var humidityForcast3 = $('#humidity3');
var tempForcast4 = $('#tempDay4');
var humidityForcast4 = $('#humidity4');
var tempForcast5 = $('#tempDay5');
var humidityForcast5 = $('#humidity5');

//api key
var apiKey = 'e7b524fee1d749595b3aa90b8bab1f55';

var city = "";
var searchedCities = [];
var icon = $('<img></img>'); 
//var currentDate = moment().format("MM/DD/YYYY");



    //save the search history
    function renderSearchHistory() {

    }

    //click button to enter city that will return forecast result
    searchButton.on('click', function() {
        city = inputCity.val();
        if(!city.length){
            return;
        }
        $.ajax({ 
            url:'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey, 
            method: 'GET'
        })
            .then(function(weatherData){
                //Here we have initial weather data
                console.log(weatherData)

              

                //Get uc index
                /*$.ajax({ 
                    url:'api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey, 
                    method: 'GET' 
                    })
                    .then(function(uvIndex){
                        //Here we have initial weather data
                        //POpoulate entire DOM with weatherdata Var and new uvIndex
                        //Calling 5 day here
                    })
                    .catch(function(err){
        
                    })*/
            })
            .catch(function(err){

            });


            //DO 5 day fetch down here






});

});
















/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast */