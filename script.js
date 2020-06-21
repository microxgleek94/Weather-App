var apiKey = "&appid=a400997ac621db3b31a40eafd7fd1b25";


// when the use clicks on the "Search" btn, this function will run
$("#search-button").click(function () {

  // the value of the city input the user will submit
  var city = $("#search-value").val();
  console.log("Submit btn was clicked");
  console.log(`The user's city input is: ${city}`);

  // Calls the function to get current weather
  currentWeather(city);

  // function for five day forecast
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

      // Log the todayURL
      console.log(`This is the todayURL: ${todayURL}`);

      // Log the resulting object
      // console.log(`This is the current weather object: ${response}`) - this returns [object, Object]
      console.log(`This is the current weather object: ${JSON.stringify(response)}`); // returns the object as a string
      // won't console log the object when using ${JSON.parse(JSON.stringify(response))}


      // API Data
      var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32); // to covert temp. into F as a whole number
      // console.log(`Temp is:${temp}`);
      var humidity = response.main.humidity;
      // console.log(`Humidity is:${humidity}`);
      var wind = response.wind.speed;
      // console.log(`Wind is:${wind}`);
      var weatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      var coord = "?lat=" + response.coord.lat + "&lon=" + response.coord.lon; // coord. var to use later for 5 day forecast


      //Create and append today's weather card
      var todayCard = $("<div>").attr("class", "card");
      $("#today").append(todayCard);
      var cardHeader = $("<h5>").attr("class", "card-header").text(response.name + " " + todaysDate);
      var weatherImg = $("<img>").attr("src", weatherIcon)
      var weatherImgText = $("<p>").text(`Today's weather will be: ${response.weather[0].description}.`);
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

      // resulting code should be : <p> Today's UV Index is: <span style="color: white; background-color: orange;">8.97</span></p>
      // currently just showing the span tag
      // also if the "search" btn is clicked multiple times, the span prints multiple times
      var uvContainer = $("<span>").css({"color": "white"}).text(todaysUV);

      var uvText = $("<p>")
      .attr({
        "class" : "card-text", 
        "id" : "uv-text", 
        }).text("Today's UV index is: ");
        
        uvText.append(uvContainer);

      if (uvText < 3) {
        uvContainer.css("background-color", "green");
      } else if (uvText < 6) {
        uvContainer.css("background-color", "yellow");
      } else if (uvText = 6 || 7) {
        uvContainer.css("background-color", "orange");
      } else if (uvText >= 8 || 10) {
        uvContainer.css("background-color", "red");
      } else {
        ("background-color", "violet");
      };

      // should append UV Index info to current weather card body
      /** currently getting error: "jQuery.Deferred exception: uvText.css is not a function TypeError:" 
       and the UV Value does not append to the current Weather Card **/
       
       $("#uv-value").append(uvContainer);

      // end of uvIndex ajax response 
    })
  // end of currentUV function
};



//Function to create five day forecast cards
function fiveDayForecast(city) {

  var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey;

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
      // console.log(`This is the five day weather forecast: ${JSON.parse(JSON.stringify(forecastInfo))}`);
      // console.log(`This is the five day weather forecast: ${JSON.stringify(forecastInfo)}`);

      // to make sure forecast div is empty when page refreshes
      $("#forecast").empty();

      // loops through the five day forecast object to get the dates and weather elements
      for (var i = 0; i < forecastInfo.length; i++) {

        // // this is to check the military time of each day's forecast and dynamically create weather cards 
        if (forecastInfo[i].dt_txt.indexOf("12:00:00") !== -1) {

          // variables containing the API response data to attach to the cards
          var fiveDate = $("<h3>").text(forecastInfo[i].dt_txt); // creates a new date for each card 5 days in the future
          var fiveImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecastInfo.weather[0].icon + ".png");
          var fiveImgText = $("<p>").text(`Today's weather will be: ${forecastInfo.weather[0].description}.`);
      
          console.log(forecastInfo.weather[0].description);

          var fiveTemp = Math.round((forecastInfo.main.temp - 273.15) * 1.80 + 32); //to covert temp. into F as a whole number
          var fiveHumidity = (forecastInfo.main.humidity);

          // the container to hold the five day cards
          var fiveDayContainer = $("<div>").attr("class", "card-group"); //row row-cols-1 row-cols-md-5
          $("#forecast").append(fiveDayContainer);
          var fiveDayHeader = $("<h5>").attr("class", "card-header").text("5-Day Forecast");
          fiveDayContainer.append(fiveDayHeader);


          // creating the five day cards and appending to the container
          var fiveDayCard = $("<div>").attr("class", "col mb-4");
          fiveDayContainer.append(fiveDayCard);
          var innerCard = $("<div>").attr({ class: "card", id: "five-day-card" });
          fiveDayCard.append(innerCard);
          // this card will hold all the weather data
          var innerCardBody = $("<div>").attr("class", "card-body");
          innerCard.append(innerCardBody);
          var fiveDateDisplay = $("<h4>").attr("class", "card-title").text(fiveDate);
          var fiveImageDisplay = $("<img>").attr("src", fiveImg);
          var fiveTempDisplay = $("<p>").attr("class", "card-text").html("Temp: " + fiveTemp + "&deg;F");
          var fiveHumidityDisplay = $("<p>").attr("class", "card-text").html("Humidity: " + fiveHumidity + '&#37;');
          innerCardBody.append(fiveDateDisplay, fiveImageDisplay, fiveImgText, fiveTempDisplay, fiveHumidityDisplay);
        
          // end of the "if" statement
          }
      }
      //end of ajax call for five day forecast
    })
  //end of fiveDayForecast function         
}


      //** Still Need to Do **/

      // Function for local storage

