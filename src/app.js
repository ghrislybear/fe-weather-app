const now = new Date();

// Show day of week and time of day

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const date = now.getDate();
const days = weekDays[now.getDay()];
const month = months[now.getMonth()];
const hours = now.getHours();
const minutes = now.getMinutes();
const year = now.getFullYear();

const fahrenheit = document.querySelectorAll(".fahrenheit");
const celsius = document.querySelector(".celsius");
const allTemperatures = document.querySelectorAll(
  "#current-temperature, #high-temp, #low-temp, #feels-like-temp, .forecast-high, .forecast-low"
);
celsius.addEventListener("click", showToggleTemp);

function convertCelsiusToFahrenheit(celsius) {
  return Math.round(celsius * (9 / 5) + 32);
}

function convertFahrenheitToCelsius(fahrenheit) {
  return Math.round((fahrenheit - 32) * (5 / 9));
}

function handleToggleTemperatureUnit(element, temperature) {
  if (celsius.innerHTML === "F") {
    element.innerHTML = `${convertFahrenheitToCelsius(temperature)}°`;
  } else {
    element.innerHTML = Math.round(temperature);
  }
}

function localDate(unix, timezone) {
  const date = new Date();
  const timezoneOffsetMs = date.getTimezoneOffset() * 60000;
  const utc = unix + timezoneOffsetMs;
  const timezoneMs = 1000 * timezone;
  const updatedDate = new Date(utc + timezoneMs);
  return updatedDate;
}

//Display values for searched city
function displayForecast(response) {
  const temp = document.querySelector("#current-temperature");
  const todayTemp = response.data.main.temp.toFixed(0);

  handleToggleTemperatureUnit(temp, todayTemp);

  const windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = response.data.wind.speed;

  const description = document.querySelector("#weather-main");
  description.innerHTML =
    response.data.weather[0].description.charAt(0).toUpperCase() +
    response.data.weather[0].description.slice(1);

  const humidity = document.querySelector("#humidity-value");
  humidity.innerHTML = response.data.main.humidity;

  const cloudiness = document.querySelector("#cloudiness-value");
  cloudiness.innerHTML = response.data.clouds.all;

  const visibility = document.querySelector("#visibility-value");
  visibility.innerHTML = `${Math.round(response.data.visibility / 1000)}`;

  const atmp = document.querySelector("#pressure-value");
  atmp.innerHTML = response.data.main.pressure;

  const highTemp = document.querySelector("#high-temp");
  handleToggleTemperatureUnit(highTemp, response.data.main.temp_max);

  const lowTemp = document.querySelector("#low-temp");
  handleToggleTemperatureUnit(lowTemp, response.data.main.temp_min);

  const feelsLikeTemp = document.querySelector("#feels-like-temp");
  handleToggleTemperatureUnit(feelsLikeTemp, response.data.main.feels_like);

  console.log(response.data);

  // Display today's weather icon
  const iconElement = document.querySelector("#searched-weather-icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  console.log(typeof response.data.weather[0].icon);

  // Sun times
  const sunrise = document.querySelector("#sunrise-time");
  const sunset = document.querySelector("#sunset-time");
  const apiSunrise = response.data.sys.sunrise * 1000;
  const apiSunset = response.data.sys.sunset * 1000;
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const timezone = response.data.timezone;
  sunrise.innerHTML = localDate(apiSunrise, timezone).toLocaleString(
    [],
    options
  );
  sunset.innerHTML = localDate(apiSunset, timezone).toLocaleString([], options);

  // Change Current Time/Date to Location
  const currentDate = document.querySelector("#current-date");
  const today = new Date();
  const localToday = localDate(today.getTime(), timezone);
  const dateStatement = `${localToday.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  })}, ${year}`;
  currentDate.innerHTML = `${dateStatement}`;

  const currentTime = document.querySelector("#current-time");
  const timeStatement = `${localToday.toLocaleString([], options)}`;
  currentTime.innerHTML = `${timeStatement}`;

  getForecast(response.data.coord);

  const weekday = localToday.toLocaleDateString("en-US", { weekday: "long" });
  const weekdayIndex = weekDays.indexOf(weekday);
  const weekdayProgression = weekDays
    .slice(weekdayIndex, weekDays.length)
    .concat(weekDays.slice(0, weekdayIndex));

  const forecastDays = document.querySelectorAll(".forecast-day");
  forecastDays.forEach((element, index) => {
    element.innerHTML = weekdayProgression[index + 1];
  });
}

function getForecast(coordinates) {
  const apiKey = "e0a5a97de9a0b7a951e9d154a8f9bad8";
  const apiOne = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiOne).then(displayNextForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return day;
}

function displayNextForecast(response) {
  const daily = response.data.daily;

  const forecastHigh = document.querySelectorAll(".forecast-high");
  const forecastLow = document.querySelectorAll(".forecast-low");

  daily.slice(1, 6).forEach((day, index) => {
    const { min, max } = day.temp;

    handleToggleTemperatureUnit(forecastHigh[index], max);
    handleToggleTemperatureUnit(forecastLow[index], min);
  });
  console.log(response.data.daily);
}

function capitalizeWords(phrase) {
  words = phrase.split(" ");
  capitalizedWords = words.map(
    (word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`
  );
  return capitalizedWords.join(" ");
}

function parseTemperatureInnerHTML(element) {
  let newText = element.textContent;
  if (newText.charAt(newText.length - 1) === "°") {
    newText = newText.slice(0, newText.length - 1);
  }

  if (typeof newText != "number") {
    newText = parseInt(newText);
  }

  return newText;
}

// Toggle Fahrenheit and Celsius Temp
function showToggleTemp(event) {
  event.preventDefault();

  if (celsius.innerHTML === "C") {
    //F to C
    celsius.innerHTML = "F";
    fahrenheit.forEach((el) => (el.innerHTML = "C"));
    allTemperatures.forEach((el) => {
      const newText = parseTemperatureInnerHTML(el);
      el.textContent = `${convertFahrenheitToCelsius(newText)}°`;
    });
  } else if (celsius.innerHTML === "F") {
    //C to F
    celsius.innerHTML = "C";
    fahrenheit.forEach((el) => (el.innerHTML = "F"));
    allTemperatures.forEach((el) => {
      const newText = parseTemperatureInnerHTML(el);
      el.textContent = `${convertCelsiusToFahrenheit(newText)}`;
    });
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const searchInput = document.querySelector("#city-input");
  const citySearched = document.querySelector("#current-location");
  citySearched.innerHTML = capitalizeWords(searchInput.value);
  search(searchInput.value);
}

// Display the searched city
function search(city) {
  const apiKey = "ce5283d6a2b16fd0c2c850e44822f6d1";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayForecast);

  let form = document.querySelector("#input-search");
  form.addEventListener("submit", handleSubmit);
}

search("Cebu City");
