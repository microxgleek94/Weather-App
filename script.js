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
  })
    .then(function (response) {

      // Log the queryURL
      console.log(todayURL);

      // Log the resulting object
      console.log(`This is the current weather object: ${JSON.stringify(response)}`);
      // won't console log the object = ${JSON.parse(JSON.stringify(response))}


      // API Data
      var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32); // to covert temp. into F as a whole number
      console.log(`Temp is:${temp}`);
      var humidity = response.main.humidity;
      console.log(`Humidity is:${humidity}`);
      var wind = response.wind.speed;
      console.log(`Wind is:${wind}`);
      var weatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      var coord = '?lat=' + response.coord.lat + '&lon=' + response.coord.lon; // coord. var to use later for 5 day forecast


      //Create and append today's weather card
      var todayCard = $("<div>").attr("class", "card");
      $("#today").append(todayCard);
      var cardHeader = $("<h5>").attr("class", "card-header").text(response.name + " " + todaysDate);
      var weatherImg = $("<img>").attr("src", weatherIcon)
      var weatherImgText = $("<p>").text(`Today's weather will be: ${response.weather[0].description}.`);
      todayCard.append(cardHeader);
      cardHeader.append(weatherImg, weatherImgText);

      var cardBody = $("<div>").attr({ class: "card-body" , id: "uv-value"});
      // this id helps to ad UV info to main card body once its ajax call is made later on ( ref. line 118)

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

//Function to get Today's UV Index
// The current UV index is collected at the same time as the current weather
//  by making use of the searched city's returned coordinates

function currentUV(coord) {

  var uvURL = "http://api.openweathermap.org/data/2.5/uvi" + coord + apiKey;


  $.ajax({
    url: uvURL,
    method: "GET",
  })
    .then(function (response) {

      // Log the queryURL
      console.log(uvURL);

      // Log the resulting object
      console.log(`This is the current UV object: ${JSON.stringify(response)}`);
      // won't console log the object = ${JSON.parse(JSON.stringify(response))}

      var todaysUV = response.value;

      var uvText = $("<p>").attr("card-text")
        .css({
          "border": "1px, solid, black",
          "color": "white"
        }).html("Today's UV index is: " + todaysUV);
       

      if (uvText < 3) {
        uvText.css("background-color", "green");
      } else if (uvText < 6) {
        uvText.css("background-color", "yellow");
      } else if (uvText = 6 || 7) {
        uvText.css("background-color", "orange");
      } else if (uvText >= 8 || 10 ) {
        uvText.css("background-color", "red");
      } else {
        ("background-color", "violet");
      };

      // appends UV Index infor to current weather card body (ref. line 58)
      // ** currently getting error: "jQuery.Deferred exception: uvText.css is not a function TypeError:" 
      // and the UV Value does not append to the current Weather Card
      $("#uv-value").append(uvText);

    // end of uvIndex ajax response 
    })
// end of currentUV function
};










//** Still Need to Do **/

// Function for local storage





//Function to get lat/lon values for the five day weather forecast


//Function to create five day forecast cards