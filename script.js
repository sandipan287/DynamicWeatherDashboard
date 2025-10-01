const apiKey = "6e0cb80df049dfc9f4af76ec41119817"; 
let weatherData = null;
let isCelsius = true;

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  try {
    // Current weather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    weatherData = await response.json();
    displayWeather();

    // Forecast
    getForecast(city);

  } catch (error) {
    alert(error.message);
  }
}

function displayWeather() {
  if (!weatherData) return;

  const temp = isCelsius 
    ? weatherData.main.temp.toFixed(1)
    : (weatherData.main.temp * 9/5 + 32).toFixed(1);
  const unit = isCelsius ? "°C" : "°F";

  document.getElementById("city-name").textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  document.getElementById("temperature").textContent = `${temp} ${unit}`;
  document.getElementById("condition").textContent = weatherData.weather[0].description;
  document.getElementById("feels-like").textContent = weatherData.main.feels_like;
  document.getElementById("humidity").textContent = weatherData.main.humidity;
  document.getElementById("wind").textContent = weatherData.wind.speed;
  document.getElementById("pressure").textContent = weatherData.main.pressure;
  document.getElementById("sunrise").textContent = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
  document.getElementById("sunset").textContent = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
  document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  document.querySelector(".toggle-btn").textContent = isCelsius ? "Show in °F" : "Show in °C";
}

function toggleTemperature() {
  if (!weatherData) return;
  isCelsius = !isCelsius;
  displayWeather();
}

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Forecast not found");
  const data = await response.json();
  displayForecast(data);
}

function displayForecast(data) {
  // 5-Day Forecast
  let dailyForecast = {};
  data.list.forEach(item => {
    let date = item.dt_txt.split(" ")[0];
    if (!dailyForecast[date] && item.dt_txt.includes("12:00:00")) {
      dailyForecast[date] = item;
    }
  });

  let forecastHTML = "";
  for (let date in dailyForecast) {
    let f = dailyForecast[date];
    forecastHTML += `
      <div class="forecast-item">
        <strong>${new Date(date).toDateString()}</strong><br>
        <img src="https://openweathermap.org/img/wn/${f.weather[0].icon}.png">
        <p>${f.main.temp.toFixed(1)}°C</p>
        <p>${f.weather[0].description}</p>
      </div>
    `;
  }
  document.getElementById("forecast").innerHTML = forecastHTML;

  // Hourly Forecast
  let hourlyHTML = "";
  data.list.slice(0, 6).forEach(item => {
    hourlyHTML += `
      <div class="hourly-item">
        <strong>${item.dt_txt.split(" ")[1].slice(0,5)}</strong><br>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        <p>${item.main.temp.toFixed(1)}°C</p>
      </div>
    `;
  });
  document.getElementById("hourly").innerHTML = hourlyHTML;
}

function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("current-date").textContent = now.toLocaleDateString("en-US", options);
  document.getElementById("current-time").textContent = now.toLocaleTimeString();
}
updateDateTime();
setInterval(updateDateTime, 1000);
