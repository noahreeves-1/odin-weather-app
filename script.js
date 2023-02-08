const cityForm = document.querySelector(".city-form");
const temp = document.querySelector(".temp");
const tempHigh = document.querySelector(".temp-high");
const tempLow = document.querySelector(".temp-low");
const feelsLike = document.querySelector(".feels-like");
const humidity = document.querySelector(".humidity");
const pressure = document.querySelector(".pressure");
const weatherDescription = document.querySelector(".weather-description");
const weatherGif = document.querySelector(".weather-gif");
const windSpeed = document.querySelector(".wind-speed");
const convertTempButton = document.querySelector(".convert-temp");
let convertBool = true;

cityForm.addEventListener("submit", (e) => {
  e.preventDefault();
  displayWeather();
});

convertTempButton.addEventListener("click", convertTemp);

async function getWeatherData() {
  // DOM stuff
  try {
    const cityInput = document.querySelector(".city-input");
    const cityInputValue = cityInput.value;
    // FETCH stuff
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityInputValue}&APPID=4b822e86ab11a09cfbb8dd2dbc7b1dc4`,
      { mode: "cors" }
    );
    console.log(response);

    // check IF response OK === TRUE
    if (!response.ok) {
      throw new Error("The response was not OK");
    }

    const fetchedWeatherData = await response.json();
    console.log(fetchedWeatherData);
    return fetchedWeatherData;
  } catch (err) {
    console.log(err, "Weather data was not returned");
  }
}

async function displayWeather() {
  const weatherData = await getWeatherData();

  // NAME: city
  // SYS: country
  const location = document.querySelector(".location");
  location.textContent = `${weatherData.name}, ${weatherData.sys.country}`;

  // SYS: sunrise
  const sunrise = document.querySelector(".sunrise");
  let sunriseDate = new Date(
    (weatherData.sys.sunrise + weatherData.timezone) * 1000
  );
  let sunriseHour = sunriseDate.getUTCHours();
  let sunriseMin = sunriseDate.getUTCMinutes();
  if (sunriseMin < 10) {
    sunriseMin = `0${sunriseMin}`;
  }
  sunrise.textContent = `${sunriseHour}:${sunriseMin} AM`;

  // SYS: sunset
  const sunset = document.querySelector(".sunset");
  let sunsetDate = new Date(
    (weatherData.sys.sunset + weatherData.timezone) * 1000
  );
  let sunsetHour = sunsetDate.getUTCHours();
  if (sunsetHour > 12) {
    sunsetHour = sunsetHour - 12;
  }
  let sunsetMin = sunsetDate.getUTCMinutes();
  if (sunsetMin < 10) {
    sunsetMin = `0${sunsetMin}`;
  }

  sunset.textContent = `${sunsetHour}:${sunsetMin} PM`;

  // MAIN: temp, temp high, temp low
  const tempKelvin = weatherData.main.temp;
  const tempF = KtoF(tempKelvin);
  temp.textContent = tempF.toFixed(1) + "\u00B0" + "F";
  const tempKHigh = weatherData.main.temp_max;
  const tempH = KtoF(tempKHigh).toFixed(1) + "\u00B0" + "F";
  tempHigh.textContent = tempH;
  const tempKLow = weatherData.main.temp_min;
  const tempL = KtoF(tempKLow).toFixed(1) + "\u00B0" + "F";
  tempLow.textContent = tempL;

  // MAIN: feels like temp
  const feelsLikeTempK = weatherData.main.feels_like;
  const feelsLikeTempF = KtoF(feelsLikeTempK);
  feelsLike.textContent = `${feelsLikeTempF.toFixed(1)}\u00B0F`;

  //MAIN: humidity
  const humidityData = weatherData.main.humidity;
  humidity.textContent = `${humidityData}%`;

  //MAIN: pressure
  //   const pressureData = weatherData.main.pressure;
  //   pressure.textContent = `Air Pressure: ${pressureData} hPa`;

  // WEATHER[0]: description
  const weatherMainData = weatherData.weather[0].description;
  const weatherDescriptionData = weatherData.weather[0].description;
  // use GIPHY API to get a GIF of today's weather description
  weatherDescription.textContent = `${weatherMainData}, ${weatherDescriptionData}`;
  // weather GIF
  getGIF(weatherMainData);

  // WIND: speed
  const windSpeedData = weatherData.wind.speed;
  windSpeed.textContent = `${windSpeedData} m/sec`;

  return weatherData;
}

function KtoF(kelvin) {
  return 1.8 * (kelvin - 273) + 32;
}

function KtoC(kelvin) {
  return kelvin - 273.15;
}

function CtoF(celsius) {
  return celsius * (9 / 5) + 32;
}

function FtoC(fahrenheit) {
  return (fahrenheit - 32) * (5 / 9);
}

function CtoK(celsius) {
  return celsius + 273.15;
}

function FtoK(fahrenheit) {
  return (fahrenheit - 32) * (5 / 9) + 273.15;
}

async function getGIF(searchText) {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=edVw90kEqbrxRC2aw31mUZAvwowJX2gW&s=${searchText}`,
    { mode: "cors" }
  );
  const newGif = await response.json();
  console.log(newGif);
  weatherGif.src = newGif.data.images.original.url;
}

async function convertTemp() {
  const weatherData = await getWeatherData();
  let tempK = weatherData.main.temp;
  let tempKHigh = weatherData.main.temp_max;
  let tempKLow = weatherData.main.temp_min;
  let tempFeelsLike = weatherData.main.feels_like;

  if (convertBool) {
    let tempC = KtoC(tempK).toFixed(1);
    temp.textContent = `${tempC}\u00B0C`;
    let tempCHigh = KtoC(tempKHigh).toFixed(1);
    tempHigh.textContent = `${tempCHigh}\u00B0C`;
    let tempCLow = KtoC(tempKLow).toFixed(1);
    tempLow.textContent = `${tempCLow}\u00B0C`;
    let tempFeelsLikeC = KtoC(tempFeelsLike).toFixed(1);
    feelsLike.textContent = `${tempFeelsLikeC}\u00B0C`;
    convertBool = false;
  } else {
    let tempF = KtoF(tempK).toFixed(1);
    temp.textContent = `${tempF}\u00B0F`;
    let tempFHigh = KtoF(tempKHigh).toFixed(1);
    tempHigh.textContent = `${tempFHigh}\u00B0F`;
    let tempFLow = KtoF(tempKLow).toFixed(1);
    tempLow.textContent = `${tempFLow}\u00B0F`;
    let tempFeelsLikeF = KtoF(tempFeelsLike).toFixed(1);
    feelsLike.textContent = `${tempFeelsLikeF}\u00B0F`;
    convertBool = true;
  }

  //   if (!convertBool) {
  //     let tempC = parseInt(temp.textContent);
  //     let tempK = CtoK(tempC);
  //     let tempF = KtoF(tempK).toFixed(1);
  //     temp.textContent = tempF;
  //     convertBool = true;
  //     console.log("this was run");
  //   } else {
  //     let tempF = parseInt(temp.textContent);
  //     let tempK = FtoK(tempF);
  //     let tempC = KtoC(tempK).toFixed(1);
  //     temp.textContent = tempC;
  //     convertBool = false;
  //     console.log("this was also run");
  //   }
}
