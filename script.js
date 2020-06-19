// function for local storage


var apiKey = "&appid=a400997ac621db3b31a40eafd7fd1b25";

// when the use clicks on the "Search" btn, this function will run
$("#search-button").click(function () {
  console.log("Submit btn was clicked");

  // the value of the city input the user will submit
  var city = $("#search-value").val();
  console.log(city);

  // Calls the function to get current weather
  currentWeather(city);

});


//  Current Weather 
function currentWeather(city) {
  
  var todayURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
  var todaysDate = moment().format('MMMM Do YYYY, h:mm a');


  $.ajax({
    url: todayURL,
    method: "GET",
    // end of ajax call for todaysWeather
  })
    .then(function (response) {
    
      // Log the queryURL
      console.log(todayURL);

      // Log the resulting object
      console.log(response);


      // API Data
      var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32); // to covert temp. into F
      console.log(`Temp is:${temp}`);
      var humidity = response.main.humidity;
      console.log(`Humidity is:${humidity}`);
      var wind = response.wind.speed;
      console.log(`Wind is:${wind}`);
      var weatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      var coord = '?lat=' + response.coord.lat + '&lon=' + response.coord.lon;


      //Create and append today's weather card
      var todayCard = $("<div>").attr("class", "card");
      $("#today").append(todayCard);
      var cardHeader = $("<h5>").attr("class", "card-header").text(response.name + " " + todaysDate);
      var weatherImg = $("<img>").attr("src", weatherIcon);
      todayCard.append(cardHeader);
      cardHeader.append(weatherImg);
      var cardBody = $("<div>").attr({ class: "card-body", id: "uv-value" });
      todayCard.append(cardBody);
      var tempInfo = $("<p>").attr("class", "card-text").html("Temperature: " + temp + "&deg;F");
      var humidityInfo = $("<p>").attr("class", "card-text").html("Humidity: " + humidity + "&#37;");
      var windInfo = $("<p>").attr("class", "card-text").html("Wind Speed: " + wind + "MPH");
      cardBody.append(tempInfo, humidityInfo, windInfo);
      // end of response function
    });
  // end of current weather function
};


