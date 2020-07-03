var apiKey = "&appid=a400997ac621db3b31a40eafd7fd1b25";

// // to clear local storage when browser is refreshed
window.onbeforeunload = function (e) {
  localStorage.clear();
};

$('#today').empty();
$('#forecast').empty();

// when the use clicks on the "Search" btn, this function will run
$("#search-button").click(function () {
  event.preventDefault();
  //to empty the weather containers when the search button is clicked
  $('#today').empty();
  $('#forecast').empty();

  // the value of the city input the user will submit
  var city = $("#search-value").val();
  console.log("Submit btn was clicked");
  console.log(`The user's city input is: ${city}`);

  // //Clear input box
  $("#search-value").val('');

  //to create the past history display
  var cityList = $("<button>")
    .attr({
      type: "button",
      class: "list-group-item list-group-item-action",
      id: "historysearch"
    })
  var historyText = cityList.text(city);
  $("#history").prepend(historyText);

  // Calls the function to get current weather
  currentWeather(city);

  // Calls function for five day forecast
  fiveDayForecast(city);
});


//  Current Weather 
function currentWeather(city) {

  var todayURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
  var todaysDate = moment().format('MMMM Do YYYY, h:mm a');


  $.ajax({
    url: todayURL,
    method: "GET",

  })
    .then(function (response) {

      // this will push the city that is searched's information to the empty array for local storage
      if (pastHistory.indexOf(city) === -1) {
        pastHistory.push(city);
        window.localStorage.setItem("cityhistory", JSON.stringify(pastHistory));
      }


      // Log the todayURL
      console.log(`This is the todayURL: ${todayURL}`);

      var currentWeatherInfo = response;

      // Log the resulting object
      // console.log(`This is the current weather object: ${response}`) - this returns [object, Object]
      // console.log(`This is the current weather object: ${JSON.stringify(currentWeatherInfo)}`); // returns the object as a string
      // won't console log the object when using ${JSON.parse(JSON.stringify(response))}


      // API Data
      var temp = Math.round((currentWeatherInfo.main.temp - 273.15) * 1.80 + 32); // to covert temp. into F as a whole number
      // console.log(`Temp is:${temp}`);
      var humidity = currentWeatherInfo.main.humidity;
      // console.log(`Humidity is:${humidity}`);
      var wind = currentWeatherInfo.wind.speed;
      // console.log(`Wind is:${wind}`);
      var weatherIcon = "https://openweathermap.org/img/w/" + currentWeatherInfo.weather[0].icon + ".png";
      var coord = "?lat=" + currentWeatherInfo.coord.lat + "&lon=" + currentWeatherInfo.coord.lon; // coord. var to use later for 5 day forecast
      var country = currentWeatherInfo.sys.country;
      console.log(`The country for this city is ${country}`);

      //Create and append today's weather card
      var todayCard = $("<div>").attr("class", "card");
      $("#today").append(todayCard);
      var cardHeader = $("<h5>").attr("class", "card-header").html(currentWeatherInfo.name + ", " + country + "<br>" + todaysDate);
      var weatherImg = $("<img>").attr("src", weatherIcon)
      var weatherImgText = $("<p>").text(`Today's weather will be: ${currentWeatherInfo.weather[0].description}.`);
      todayCard.append(cardHeader);
      cardHeader.append(weatherImg, weatherImgText);

      // this id helps to add UV info to main card body once its ajax call is made later on
      var cardBody = $("<div>").attr({ class: "card-body", id: "uv-value" });


      todayCard.append(cardBody);
      var tempInfo = $("<p>").attr("class", "card-text").html("Temperature: " + temp + "&deg;F");
      var humidityInfo = $("<p>").attr("class", "card-text").html("Humidity: " + humidity + "&#37;");
      var windInfo = $("<p>").attr("class", "card-text").html("Wind Speed: " + wind + "MPH");
      cardBody.append(tempInfo, humidityInfo, windInfo);

      // using the lat & lon coord. from the city submission to put into th UV Index function
      currentUV(coord);

      // end of current weather ajax response function
    });
  // end of current weather function
};

// Function to get Today's UV Index
// The current UV index is collected at the same time as the current weather
//  by making use of the searched city's returned coordinates
function currentUV(coord) {

  var uvURL = "https://api.openweathermap.org/data/2.5/onecall" + coord + "&exclude=daily,hourly,minutely" + apiKey;


  $.ajax({
    url: uvURL,
    method: "GET",
  })
    .then(function (response) {

      // Log the queryURL
      console.log(`This is the uvURL: ${uvURL}`);

      var todaysUV = response.current.uvi;

      // Log the resulting object
      console.log(`This is the current UV value: ${todaysUV}`);
      // won't console log the object when using ${JSON.parse(JSON.stringify(response))}

      // appending UV Index to Current Weather container
      var uvContainer = $("<span>").text(todaysUV).attr("id", "uv-background").css("color", "white");
      var uvText = $("<p>")
        .attr({
          class: "card-text",
          id: "uv-text",
          value: todaysUV,
        })
        .html("Today's UV index is: ");

      $("#uv-value").append(uvText, uvContainer);
      uvText.append(uvContainer);


      if (todaysUV < 3) {
         uvContainer.css("background-color", "green");
      } else if ( todaysUV < 7) {
         uvContainer.css("background-color", "#dcc83b");
      } else if (todaysUV < 8) {
        uvContainer.css("background-color", "orange");
      } else if (todaysUV < 10) {
         uvContainer.css("background-color", "red");
      } else {
        uvContainer.css("background-color", "purple");
      }
      // end of uvIndex ajax response 
    })
  // end of currentUV function
};


//Function to create five day forecast cards
function fiveDayForecast(city) {

  var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey;

  // testing 5 Day Forecast object
  // https://api.openweathermap.org/data/2.5/forecast?q=copiague&appid=a400997ac621db3b31a40eafd7fd1b25

  $.ajax({
    url: fiveDayURL,
    method: "GET",
  })
    .then(function (response) {

      // log the fiveDayURL
      console.log(`This is the fivedayURL: ${fiveDayURL}`);

      var forecastInfo = response.list;
      // logging the resulting object for the five day forcast
      // console.log(`This is the five day weather forecast:${forecastInfo}`);

      // the container to hold the five day cards
      var fiveDayContainer = $("<div>").attr("class", "card-group"); //row row-cols-1 row-cols-md-5
      $("#forecast").append(fiveDayContainer);
      var fiveDayHeader = $("<h5>").attr("class", "card-header").text("5-Day Forecast");
      fiveDayContainer.append(fiveDayHeader);

      // **Note** Because the 5 Day forcasts pulls weather data every 3 hrs for 5 days, 
      // there are 24/3 = 8 sets of weather data per day // 8*5 = 40 returning objects for the 5 day call
      // this for loop will iterate through the object 8x and pull the data so that way 5 weather cards are created
      for (var i = 0; i < forecastInfo.length; i += 8) {

        // console.log(forecastInfo[i].weather[0].description);

        // variables containing the API response data to attach to the cards
        var fiveImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecastInfo[i].weather[0].icon + ".png");
        var fiveImgText = $("<p>").text(`This day's weather will be: ${forecastInfo[i].weather[0].description}.`);
        var fiveTemp = Math.round((forecastInfo[i].main.temp - 273.15) * 1.80 + 32); //to covert temp. into F as a whole number
        var fiveHumidity = (forecastInfo[i].main.humidity);
        var fiveDayDate = new Date(forecastInfo[i].dt_txt)

        // creating the five day cards and appending to the container
        var innerCard = $("<div>").attr({ class: "card", id: "five-day-card" });
        var innerCardBody = $("<div>").attr("class", "card-body");
        var fiveDateDisplay = $("<h4>").attr("class", "card-title").text(fiveDayDate.toDateString()); // creates a new date for each card 5 days in the future
        var fiveImageDisplay = fiveImg;
        var fiveTempDisplay = $("<p>").attr("class", "card-text").html("Temp: " + fiveTemp + "&deg;F");
        var fiveHumidityDisplay = $("<p>").attr("class", "card-text").html("Humidity: " + fiveHumidity + "&#37;");
        innerCardBody.append(fiveDateDisplay, fiveImageDisplay, fiveImgText, fiveTempDisplay, fiveHumidityDisplay);
        innerCard.append(innerCardBody);
        fiveDayContainer.append(innerCard);

        // console.log(fiveDateDisplay);
        // console.log(fiveImg);
        // console.log(fiveHumidity + "&#37;");
        // console.log(fiveTemp + "&deg;F");
      }
      //end of ajax call for five day forecast
    })
  //end of fiveDayForecast function         
};

// Function to search for clicked items in history list
// **Note** You had to first target the container that holds the buttons (.history)
// and then on the ".on("click") you had to add the id's for the buttons so the click event would register
$("#history").on("click", "#historysearch", function () {
  // event.preventDefault();
  $("#today").empty();
  $("#forecast").empty();
  console.log("A previous city was clicked");

  var newSearchCity = $(this).text();
  console.log(`The new search city's weather is: ${newSearchCity}`);

  currentWeather(newSearchCity);
  fiveDayForecast(newSearchCity);
});


// Code to retrieve local storage information
var pastHistory = JSON.parse(localStorage.getItem("cityhistory")) || [];

if (pastHistory.length > 0) {
  currentWeather(pastHistory[pastHistory.length - 1]);
}

for (var i = 0; i < pastHistory.length; i++) {
  var cityList = $("<button>")
    .attr({
      type: "button",
      class: "list-group-item list-group-item-action",
      id: "historysearch"
    })
  var historyText = cityList.text(pastHistory[i]);
  $("#history").prepend(historyText);
  console.log(`this is the local storage of past cities searched: ${pastHistory}`);
}

