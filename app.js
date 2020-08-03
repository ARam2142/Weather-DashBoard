$(document).ready(function() {
    ////////////DECLARE VARIABLES WE MIGHT NEED
    
    //variable for city search button
    const searchButton = $('#city-search'); 
    const inputCity = $('#city-input');
    
    //variables for selected city display
    var cityName = $('#city-name'); 
    var currentDate = $('#date');
    var weatherIconEl = $('#weather-icon');
    var temperatureEl = $('#temperature');
    var humidityEl = $('#humidity');
    var windSpeedEl = $('#wind-speed');
    var uvIndexEl = $('#uv-index');
    
    //variables for the 5 day forcast cards
    var tempForcast1 = $('#tempDay1');
    var humidityForcast1 = $('#humidity1');
    var tempForcast2 = $('#tempDay2');
    var humidityForcast2= $('#humidity2');
    var tempForcast3 = $('#tempDay3');
    var humidityForcast3 = $('#humidity3');
    var tempForcast4 = $('#tempDay4');
    var humidityForcast4 = $('#humidity4');
    var tempForcast5 = $('#tempDay5');
    var humidityForcast5 = $('#humidity5');
    var forcastOneEl = $('#date1');
    var forcastTwoEl = $('#date2');
    var forcastThreeEl = $('#date3');
    var forcastFourEl = $('#date4');
    var forcastFiveEl = $('#date5');
    var iconDay1El = $('#icon-1');
    var iconDay2El = $('#icon-2');
    var iconDay3El = $('#icon-3');
    var iconDay4El = $('#icon-4');
    var iconDay5El = $('#icon-5');
    var cityRows = $('div.cityRows');
    
    //api key
    var apiKey = 'e7b524fee1d749595b3aa90b8bab1f55';
    var city = "";
    var searchedCities = [];
    
        function loadSearchHistory() {
            //get saved searchedcities from local storage
            let savedHistory = JSON.parse(localStorage.getItem("searchedcities"));
            //if items were retrieved from local storage, update the searchedCities array to it
            if (!searchedCities) {
                savedHistory = searchedCities;
            }
            displaySearchHistory();
            console.log(searchedCities)
        }   
        
        //save search results
        function saveSearchResults() {
            searchedCities.push(city);
            inputCity.value = ""
            localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
            displaySearchHistory();
        }

        function displaySearchHistory() {
            cityRows.empty();
            searchedCities.forEach(function () {
                let divCityEl = $("<div></div>").addClass('col-12 city');
                //console.log(divCityEl);
    
                let buttonCityEl = $('<button></button>').addClass('btn btn-light');
                buttonCityEl.text(city);
                //console.log(buttonCityEl);
    
                divCityEl.append(buttonCityEl);
                //console.log(divCityEl.append(buttonCityEl));
    
                cityRows.append(divCityEl);
                //console.log( cityRows.append(divCityEl));
      
            });
            
        }
    
        //click button to enter city that will return forecast result
        searchButton.on('click', function(e) {
            displaySearchHistory();
            saveSearchResults();
            e.preventDefault();
            city = inputCity.val();
            if(!city.length){
                return;
            }
            $.ajax({ 
                url:'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey, 
                method: "GET"
            })
                .then(function(weatherdata){
                    //Here we have initial weather data
                    cityName.text(weatherdata.name);
                    let apiIcon = weatherdata.weather[0].icon;
                    weatherIconEl.attr( 'src', "http://openweathermap.org/img/w/" + apiIcon + '.png');   
                    currentDate.text(moment().format('l'));
                    temperatureEl.text(((Math.round(weatherdata.main.temp - 273.15) * 9/5 + 32)));
                    humidityEl.text(weatherdata.main.humidity);
                    windSpeedEl.text(weatherdata.wind.speed);
                    console.log(weatherdata)
                    
    
                    let lat = weatherdata.coord.lat;
                    let lon = weatherdata.coord.lon;
                    //DO 5 day fetch down here
                    $.ajax({
                        url:'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey,
                        method: "GET"
                    })

                    .then(function(fiveDayForcast) {
                        console.log(fiveDayForcast);
                        uvIndexEl.text((fiveDayForcast.current.uvi));

                         //0-2 is green
                         if (fiveDayForcast.current.uvi < 2.9) {
                            $(uvIndexEl).addClass("green");
                        }
                
                        //3-5 is yellow
                        else if (fiveDayForcast.current.uvi >= 3 && fiveDayForcast.current.uvi < 6) {
                            $(uvIndexEl).addClass("yellow");
                        }
                        
                        //6-7 is orange
                        else if (fiveDayForcast.current.uvi >= 6 && fiveDayForcast.current.uvi < 8) {
                            $(uvIndexEl).addClass("orange");
                        } 
                        
                        //8-10 is red
                        else if (fiveDayForcast.current.uvi >= 8 && fiveDayForcast.current.uvi < 11) {
                            $(uvIndexEl).addClass("red");
                        }

                        //above 11 is violet
                        else  {
                            $(uvIndexEl).addClass("violet");
                        }
    
                        //forcast day 1
                        forcastOneEl.text(moment().add(1, 'd').format('MM-DD-YYYY'));
                        let weatherIcon1 = fiveDayForcast.daily[0].weather[0].icon;
                        iconDay1El.attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon1 + '.png');
                        tempForcast1.text(Math.round(fiveDayForcast.daily[0].temp.day - 273.15) * 9/5 + 32);
                        humidityForcast1.text(fiveDayForcast.daily[0].humidity);
                        
                        
                        //forcast day 2
                        forcastTwoEl.text(moment().add(2, 'd').format('MM-DD-YYYY'));
                        let weatherIcon2 = fiveDayForcast.daily[1].weather[0].icon
                        iconDay2El.attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon2 + '.png');
                        tempForcast2.text(Math.round(fiveDayForcast.daily[1].temp.day - 273.15) * 9/5 + 32);
                        humidityForcast2.text(fiveDayForcast.daily[1].humidity);
    
                        //forcast day 3
                        forcastThreeEl.text(moment().add(3, 'd').format('MM-DD-YYYY'));
                        let weatherIcon3 = fiveDayForcast.daily[2].weather[0].icon
                        iconDay3El.attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon3 + '.png');
                        tempForcast3.text(Math.round(fiveDayForcast.daily[2].temp.day - 273.15) * 9/5 + 32);
                        humidityForcast3.text(fiveDayForcast.daily[2].humidity);
    
                        //forcast day 4
                        forcastFourEl.text(moment().add(4, 'd').format('MM-DD-YYYY'));
                        let weatherIcon4 = fiveDayForcast.daily[3].weather[0].icon
                        iconDay4El.attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon4 + '.png');
                        tempForcast4.text(Math.round(fiveDayForcast.daily[3].temp.day - 273.15) * 9/5 + 32);
                        humidityForcast4.text(fiveDayForcast.daily[3].humidity);
    
                        //forcast day 5
                        forcastFiveEl.text(moment().add(5, 'd').format('MM-DD-YYYY'));
                        let weatherIcon5 = fiveDayForcast.daily[4].weather[0].icon
                        iconDay5El.attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon5 + '.png');
                        tempForcast5.text(Math.round(fiveDayForcast.daily[4].temp.day - 273.15) * 9/5 + 32);
                        humidityForcast5.text(fiveDayForcast.daily[4].humidity);
                        
                    })
    
                })
                .catch(function(err){
            });
    });
    
});
    
    /*
    WHEN I click on a city in the search history
    THEN I am again presented with current and future conditions for that city
    WHEN I open the weather dashboard
    THEN I am presented with the last searched city forecast */