const apiKey = '27e67cd2774dd8a7ccf7da496bb96f74';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const weatherCard = document.getElementById('weather-card');
const currentLocationBtn = document.getElementById('current-location');

const url = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
const urlByCoords = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

// Create raindrops
function createRaindrops() {
  const rainContainer = document.querySelector('.rain');
  rainContainer.innerHTML = '';
  
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement('div');
    drop.classList.add('drop');
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    rainContainer.appendChild(drop);
  }
}

// Create snowflakes
function createSnowflakes() {
  const snowContainer = document.querySelector('.snow');
  snowContainer.innerHTML = '';
  
  for (let i = 0; i < 30; i++) {
    const flake = document.createElement('img');
    flake.src = 'icons/snow.svg';
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.animationDuration = `${3 + Math.random() * 5}s`;
    flake.style.animationDelay = `${Math.random() * 2}s`;
    flake.style.width = `${5 + Math.random() * 10}px`;
    flake.style.height = flake.style.width;
    snowContainer.appendChild(flake);
  }
}

// Initialize weather animations
createRaindrops();
createSnowflakes();

// Get current date
function getCurrentDate() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const now = new Date();
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  
  return `${day}, ${date} ${month}`;
}

async function getWeatherByLocation(city) {
  try {
    const resp = await fetch(url(city));
    if (!resp.ok) {
      throw new Error('City not found');
    }
    const respData = await resp.json();
    console.log(respData);
    addWeatherToPage(respData);
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const resp = await fetch(urlByCoords(lat, lon));
    if (!resp.ok) {
      throw new Error('Location not found');
    }
    const respData = await resp.json();
    console.log(respData);
    addWeatherToPage(respData);
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
}

function showError(message) {
  weatherCard.style.display = 'none';
  main.innerHTML = `<div class="error-message"><p>${message}</p></div>`;
  
  // Hide error message after 3 seconds
  setTimeout(() => {
    main.innerHTML = '';
  }, 3000);
}

function addWeatherToPage(data) {
  const temp = Ktoc(data.main.temp);
  const feelsLike = Ktoc(data.main.feels_like);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const weatherDescription = data.weather[0].description;
  const cityName = data.name;
  const country = data.sys.country;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Update weather card
  document.getElementById('city-name').textContent = `${cityName}, ${country}`;
  document.getElementById('weather-date').textContent = getCurrentDate();
  document.getElementById('temp-value').textContent = temp;
  document.getElementById('weather-icon-img').src = iconUrl;
  document.getElementById('weather-desc').textContent = weatherDescription;
  document.getElementById('humidity').textContent = `${humidity}%`;
  document.getElementById('wind-speed').textContent = `${windSpeed} m/s`;
  document.getElementById('feels-like').textContent = `${feelsLike}°C`;
  
  // Show weather card
  weatherCard.style.display = 'block';
  
  // Clear previous weather info but keep animation container intact
  const animationContainer = document.querySelector('.weather-animation');
  main.innerHTML = "";
  main.appendChild(animationContainer);

  // Update animation based on weather code
  updateWeatherAnimation(data.weather[0].id);
}

function Ktoc(K) {
  return Math.floor(K - 273.15);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const city = search.value.trim();

  if (city) {
    getWeatherByLocation(city);
  }
});

// Current location button
currentLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      error => {
        console.error('Error getting location:', error);
        showError('Unable to get your location. Please try searching for a city.');
      }
    );
  } else {
    showError('Geolocation is not supported by your browser.');
  }
});

// Function to toggle animations based on weather code
function updateWeatherAnimation(weatherCode) {
  const sun = document.querySelector('.sun');
  const clouds = document.querySelector('.clouds');
  const clear = document.querySelector('.clear');
  const rain = document.querySelector('.rain');
  const thunderstorm = document.querySelector('.thunderstorm');
  const partiallyCloudy = document.querySelector('.partially-cloudy');
  const snow = document.querySelector('.snow');

  // Hide all first
  sun.style.display = 'none';
  clouds.style.display = 'none';
  clear.style.display = 'none';
  rain.style.display = 'none';
  thunderstorm.style.display = 'none';
  partiallyCloudy.style.display = 'none';
  snow.style.display = 'none';

  // Show appropriate animation based on weather code
  if (weatherCode === 800) {
    sun.style.display = 'block'; // Clear sky
    clear.style.display = 'block';
  } else if (weatherCode >= 801 && weatherCode <= 802) {
    partiallyCloudy.style.display = 'block'; // Partially cloudy
  } else if (weatherCode >= 803 && weatherCode <= 804) {
    clouds.style.display = 'flex'; // Mostly cloudy
  } else if (weatherCode >= 200 && weatherCode < 300) {
    thunderstorm.style.display = 'block'; // Thunderstorm
  } else if (weatherCode >= 300 && weatherCode < 600) {
    rain.style.display = 'block'; // Rain
    createRaindrops(); // Recreate raindrops for animation
  } else if (weatherCode >= 600 && weatherCode < 700) {
    snow.style.display = 'block'; // Snow
    createSnowflakes(); // Recreate snowflakes for animation
  }
}

// Set default city on page load
window.addEventListener('load', () => {
  // Try to get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      error => {
        // If geolocation fails, show a default city
        getWeatherByLocation('New York');
      }
    );
  } else {
    // If geolocation is not supported, show a default city
    getWeatherByLocation('New York');
  }
});
