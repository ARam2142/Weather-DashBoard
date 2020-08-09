$(document).ready(function() {
    //variable for city search button
    const searchButton = $('#city-search'); 
    const inputCity = $('#city-input');
    
    //variables for selected city display
    //var cityName = $('#city-name'); 
    //var currentDate = $('#date');
    //var weatherIconEl = $('.weather-icon');
    //var temperatureEl = $('.temperature');
    //var humidityEl = $('.humidity');
    //var windSpeedEl = $('.wind-speed');
    var uvIndexEl = $('#uv-index');
    
    //variables for the 5 day forcast cards
    var tempForcast1 = $('.tempDay1');
    var humidityForcast1 = $('.humidity1');
    var tempForcast2 = $('.tempDay2');
    var humidityForcast2= $('.humidity2');
    var tempForcast3 = $('.tempDay3');
    var humidityForcast3 = $('.humidity3');
    var tempForcast4 = $('.tempDay4');
    var humidityForcast4 = $('.humidity4');
    var tempForcast5 = $('.tempDay5');
    var humidityForcast5 = $('.humidity5');
    var forcastOneEl = $('.date1');
    var forcastTwoEl = $('.date2');
    var forcastThreeEl = $('.date3');
    var forcastFourEl = $('.date4');
    var forcastFiveEl = $('.date5');
    var iconDay1El = $('.icon-1');
    var iconDay2El = $('.icon-2');
    var iconDay3El = $('.icon-3');
    var iconDay4El = $('.icon-4');
    var iconDay5El = $('.icon-5');
    var cityRows = $('div.cityRows');
    
    //api key
    var apiKey = 'e7b524fee1d749595b3aa90b8bab1f55';
    var city = "";
    var savedData = localStorage.getItem("searchedCities");
    console.log(savedData);
    var searchedCities;
    
    //worked on with tutor
    //displays search history on left side
    if(savedData){
        searchedCities = JSON.parse(savedData);
        displaySearchHistory();
    }
    else {
        searchedCities = [];
        return null;
    }
    
    //when page refreshed the last city searched will be displayed
    //function displayLastSearchedCity() {
        /*var prevCity = searchedCities.shift(city);
        console.log(prevCity)
        if (savedData === prevCity) {
            
            
        }*/
        
        //}
        
        function displaySearchHistory() {
            cityRows.empty();
            searchedCities.forEach(function (city) {
                
                let divCityEl = $("<div>").addClass('col-12 city');
                //console.log(divCityEl);
                
                let buttonCityEl = $('<button>').addClass('btn btn-light').text(city);
                //console.log(buttonCityEl);
                
                divCityEl.append(buttonCityEl);
                //console.log(divCityEl.append(buttonCityEl));
                
                cityRows.append(divCityEl);
                //console.log( cityRows.append(divCityEl));
                
            });
        }
        
        //save search results to local storage
        function saveSearchResults() {
            //worked on with tutor
            const prevSearchIndex = searchedCities.indexOf(city);//returns first element of searchedcities array
            //console.log(prevSearchIndex);
            const notSearched = prevSearchIndex === -1; //prevSearchIndex is strictly equal to -1
            //console.log(notSearched);
            if(notSearched){
                searchedCities.unshift(city);//searchedcities adds new city to beginning of array
                
                //strinify and set "cities" in local storage to searchedcities array
                localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
            }
            else {
                const removed = searchedCities.splice(prevSearchIndex, 1);//searchedcities adds cities to prevSearchIndex
                searchedCities.unshift(removed.pop());//searchedcities adds new city to array(removed removes last element and returns it);
            }
        }
        
        //get the weather data using ajax calls below
        function getWeatherData() {
            
            $.ajax({ 
                url:'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey, 
                method: "GET"
            }).then(function(weatherdata){
                //Here we have initial weather data
                $('#city-name').text(weatherdata.name);
                let apiIcon = weatherdata.weather[0].icon;
                $('.weather-icon').attr( 'src', "http://openweathermap.org/img/w/" + apiIcon + '.png');   
                $('#date').text(moment().format('l'));
                $('.temperature').text(((Math.round(weatherdata.main.temp - 273.15) * 9/5 + 32)));
                $('.humidity').text(weatherdata.main.humidity);
                $('.wind-speed').text(weatherdata.wind.speed);
                
                
                
                let lat = weatherdata.coord.lat;
                let lon = weatherdata.coord.lon;
                $.ajax({
                    url:'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey,
                    method: "GET"
                }).then(function(fiveDayForcast) {
                    console.log(fiveDayForcast);
                    uvIndexEl.text((fiveDayForcast.current.uvi));
                    
                    if (fiveDayForcast.current.uvi < 2.9) {
                        $(uvIndexEl).addClass("green");
                    } else if (fiveDayForcast.current.uvi >= 3 && fiveDayForcast.current.uvi < 6) {
                        $(uvIndexEl).addClass("yellow");
                    } else if (fiveDayForcast.current.uvi >= 6 && fiveDayForcast.current.uvi < 8) {
                        $(uvIndexEl).addClass("orange");
                    } else if (fiveDayForcast.current.uvi >= 8 && fiveDayForcast.current.uvi < 11) {
                        $(uvIndexEl).addClass("red");
                    } else {
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
   
            }); 
        });
    }
    
    //click button to enter city that will return forecast result
        searchButton.on('click', function() {
        city = inputCity.val().trim();
        inputCity.val('');
        if(!city.length){
            return;
        }

        getWeatherData()
        //Add to searched Cites
         //Add to local stoarage
        saveSearchResults();
        displaySearchHistory();
    });




    //Jquery way of adding an event listener on an element that will not be in the DOM until later
    $(document).on('click', '.city', function(event) {
        let lastCitySearched = event.target
        console.log(lastCitySearched);

        $.ajax({ 
            url:'https://api.openweathermap.org/data/2.5/weather?q=' + lastCitySearched + '&appid=' + apiKey, 
            method: "GET"
        }).then(getWeatherData) 

    })



});

/*
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast */
