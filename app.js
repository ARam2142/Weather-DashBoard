$(document).ready(function() {
    const searchButton = $('#city-search'); 
    const inputCity = $('#city-input');
    let uvIndexEl = $('#uv-index');
    let cityRows = $('div.cityRows');
    let apiKey = 'e7b524fee1d749595b3aa90b8bab1f55';
    let city = "";
    let savedData = localStorage.getItem("searchedCities");
    let searchedCities;
    let lastCitySearched;
    
    //worked on with tutor
    //displays search history on left side
    if(savedData){
        searchedCities = JSON.parse(savedData);
        displaySearchHistory();
        searchedCities[0];
        loadFirstCity();

    } else {
        searchedCities = [];
    }
    
    function displaySearchHistory() {
        cityRows.empty();
        searchedCities.forEach(function (city) { 
            let divCityEl = $("<div>").addClass('col-12 city');
            
            let buttonCityEl = $('<button>').addClass('btn btn-light').text(city);
            
            divCityEl.append(buttonCityEl);
            
            cityRows.append(divCityEl);
        });
    }
    
    //save search results to local storage
    function saveSearchResults(event) {
        //worked on with tutor
        const prevSearchIndex = searchedCities.indexOf(city);//returns first element of searchedcities array
        const notSearched = prevSearchIndex === -1; //prevSearchIndex is strictly equal to -1
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
                $('.date1').text(moment().add(1, 'd').format('MM-DD-YYYY'));
                let weatherIcon1 = fiveDayForcast.daily[0].weather[0].icon;
                $('.icon-1').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon1 + '.png');
                $('.tempDay1').text(Math.round(fiveDayForcast.daily[0].temp.day - 273.15) * 9/5 + 32);
                $('.humidity1').text(fiveDayForcast.daily[0].humidity);
                
                //forcast day 2
                $('.date2').text(moment().add(2, 'd').format('MM-DD-YYYY'));
                let weatherIcon2 = fiveDayForcast.daily[1].weather[0].icon
                $('.icon-2').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon2 + '.png');
                $('.tempDay2').text(Math.round(fiveDayForcast.daily[1].temp.day - 273.15) * 9/5 + 32);
                $('.humidity2').text(fiveDayForcast.daily[1].humidity);
                
                //forcast day 3
                $('.date3').text(moment().add(3, 'd').format('MM-DD-YYYY'));
                let weatherIcon3 = fiveDayForcast.daily[2].weather[0].icon
                $('.icon-3').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon3 + '.png');
                $('.tempDay3').text(Math.round(fiveDayForcast.daily[2].temp.day - 273.15) * 9/5 + 32);
                $('.humidity3').text(fiveDayForcast.daily[2].humidity);
                
                //forcast day 4
                $('.date4').text(moment().add(4, 'd').format('MM-DD-YYYY'));
                let weatherIcon4 = fiveDayForcast.daily[3].weather[0].icon
                $('.icon-4').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon4 + '.png');
                $('.tempDay4').text(Math.round(fiveDayForcast.daily[3].temp.day - 273.15) * 9/5 + 32);
                $('.humidity4').text(fiveDayForcast.daily[3].humidity);
                
                //forcast day 5
                $('.date5').text(moment().add(5, 'd').format('MM-DD-YYYY'));
                let weatherIcon5 = fiveDayForcast.daily[4].weather[0].icon
                $('.icon-5').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon5 + '.png');
                $('.tempDay5').text(Math.round(fiveDayForcast.daily[4].temp.day - 273.15) * 9/5 + 32);
                $('.humidity5').text(fiveDayForcast.daily[4].humidity);
                
            }); 
        });
    }
    
    //click button to enter city that will return forecast result
    searchButton.on('click', function() {
        city = inputCity.val().trim();
        console.log(city);
        inputCity.val('');
        if(!city.length){
            return;
        }
        getWeatherData()
        saveSearchResults();
        displaySearchHistory();
    });
    
    //dumps information back into html if buttons are clicked
    function apiReload() {
        
        let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${lastCitySearched}&appid=${apiKey}`;
        
        $.ajax({
            url: weatherUrl,
            method: "GET"
        }).then(function(weatherdata){
            $('#city-name').text(weatherdata.name);
            let apiIcon = weatherdata.weather[0].icon;
            $('.weather-icon').attr( 'src', "http://openweathermap.org/img/w/" + apiIcon + '.png');   
            $('#date').text(moment().format('l'));
            $('.temperature').text(((Math.round(weatherdata.main.temp - 273.15) * 9/5 + 32)));
            $('.humidity').text(weatherdata.main.humidity);
            $('.wind-speed').text(weatherdata.wind.speed);
            
            let lat = weatherdata.coord.lat;
            let lon = weatherdata.coord.lon;
            
            let forcastUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
            
            $.ajax({
                url: forcastUrl,
                method: "GET"
            }).then(function(fiveDayForcast) {
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

                $('.date1').text(moment().add(1, 'd').format('MM-DD-YYYY'));
                let weatherIcon1 = fiveDayForcast.daily[0].weather[0].icon;
                $('.icon-1').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon1 + '.png');
                $('.tempDay1').text(Math.round(fiveDayForcast.daily[0].temp.day - 273.15) * 9/5 + 32);
                $('.humidity1').text(fiveDayForcast.daily[0].humidity);

                $('.date2').text(moment().add(2, 'd').format('MM-DD-YYYY'));
                let weatherIcon2 = fiveDayForcast.daily[1].weather[0].icon
                $('.icon-2').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon2 + '.png');
                $('.tempDay2').text(Math.round(fiveDayForcast.daily[1].temp.day - 273.15) * 9/5 + 32);
                $('.humidity2').text(fiveDayForcast.daily[1].humidity);

                $('.date3').text(moment().add(3, 'd').format('MM-DD-YYYY'));
                let weatherIcon3 = fiveDayForcast.daily[2].weather[0].icon
                $('.icon-3').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon3 + '.png');
                $('.tempDay3').text(Math.round(fiveDayForcast.daily[2].temp.day - 273.15) * 9/5 + 32);
                $('.humidity3').text(fiveDayForcast.daily[2].humidity);

                $('.date4').text(moment().add(4, 'd').format('MM-DD-YYYY'));
                let weatherIcon4 = fiveDayForcast.daily[3].weather[0].icon
                $('.icon-4').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon4 + '.png');
                $('.tempDay4').text(Math.round(fiveDayForcast.daily[3].temp.day - 273.15) * 9/5 + 32);
                $('.humidity4').text(fiveDayForcast.daily[3].humidity);

                $('.date5').text(moment().add(5, 'd').format('MM-DD-YYYY'));
                let weatherIcon5 = fiveDayForcast.daily[4].weather[0].icon
                $('.icon-5').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon5 + '.png');
                $('.tempDay5').text(Math.round(fiveDayForcast.daily[4].temp.day - 273.15) * 9/5 + 32);
                $('.humidity5').text(fiveDayForcast.daily[4].humidity);
                
                });
            })
        }
    
        //click button to see past searches
        $(document).on('click', '.city', function(event) {
            lastCitySearched = event.target.innerHTML;
            apiReload();
            
        });
    
        //loads past weather search if you refresh or open application
        function loadFirstCity() {
            
            let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCities[0]}&appid=${apiKey}`;
            
            $.ajax({
                url: weatherUrl,
                method: "GET"
            }).then(function(weatherdata){
                $('#city-name').text(weatherdata.name);
                let apiIcon = weatherdata.weather[0].icon;
                $('.weather-icon').attr( 'src', "http://openweathermap.org/img/w/" + apiIcon + '.png');   
                $('#date').text(moment().format('l'));
                $('.temperature').text(((Math.round(weatherdata.main.temp - 273.15) * 9/5 + 32)));
                $('.humidity').text(weatherdata.main.humidity);
                $('.wind-speed').text(weatherdata.wind.speed);
                
                let lat = weatherdata.coord.lat;
                let lon = weatherdata.coord.lon;
                
                let forcastUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
                
                $.ajax({
                    url: forcastUrl,
                    method: "GET"
                }).then(function(fiveDayForcast) {
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

                    $('.date1').text(moment().add(1, 'd').format('MM-DD-YYYY'));
                    let weatherIcon1 = fiveDayForcast.daily[0].weather[0].icon;
                    $('.icon-1').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon1 + '.png');
                    $('.tempDay1').text(Math.round(fiveDayForcast.daily[0].temp.day - 273.15) * 9/5 + 32);
                    $('.humidity1').text(fiveDayForcast.daily[0].humidity);

                    $('.date2').text(moment().add(2, 'd').format('MM-DD-YYYY'));
                    let weatherIcon2 = fiveDayForcast.daily[1].weather[0].icon
                    $('.icon-2').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon2 + '.png');
                    $('.tempDay2').text(Math.round(fiveDayForcast.daily[1].temp.day - 273.15) * 9/5 + 32);
                    $('.humidity2').text(fiveDayForcast.daily[1].humidity);

                    $('.date3').text(moment().add(3, 'd').format('MM-DD-YYYY'));
                    let weatherIcon3 = fiveDayForcast.daily[2].weather[0].icon
                    $('.icon-3').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon3 + '.png');
                    $('.tempDay3').text(Math.round(fiveDayForcast.daily[2].temp.day - 273.15) * 9/5 + 32);
                    $('.humidity3').text(fiveDayForcast.daily[2].humidity);

                    $('.date4').text(moment().add(4, 'd').format('MM-DD-YYYY'));
                    let weatherIcon4 = fiveDayForcast.daily[3].weather[0].icon
                    $('.icon-4').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon4 + '.png');
                    $('.tempDay4').text(Math.round(fiveDayForcast.daily[3].temp.day - 273.15) * 9/5 + 32);
                    $('.humidity4').text(fiveDayForcast.daily[3].humidity);

                    $('.date5').text(moment().add(5, 'd').format('MM-DD-YYYY'));
                    let weatherIcon5 = fiveDayForcast.daily[4].weather[0].icon
                    $('.icon-5').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon5 + '.png');
                    $('.tempDay5').text(Math.round(fiveDayForcast.daily[4].temp.day - 273.15) * 9/5 + 32);
                    $('.humidity5').text(fiveDayForcast.daily[4].humidity);
                    
                });
            })
        }
});
