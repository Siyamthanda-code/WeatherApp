const apiKey = '27e67cd2774dd8a7ccf7da496bb96f74';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
  
const url = (city)=> `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;


async function getWeatherByLocation(city){
     try{
         const resp = await fetch(url(city));
         if (!resp.ok){
            throw new Error ('City not found');
         }
         const respData = await resp.json();
     console.log(respData);
           addWeatherToPage(respData);
        }catch (error) {
            console.error(error);
            main.innerHTML = `<p>${error.message}</p>`;
        }
     }

      function addWeatherToPage(data){
          const temp = Ktoc(data.main.temp);

          const weather = document.createElement('div')
          weather.classList.add('weather');

          weather.innerHTML = `
          <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
          <small>${data.weather[0].main}</small>
          
          `;


        //   cleanup 
          main.innerHTML= "";
           main.appendChild(weather);
      };


     function Ktoc(K){
         return Math.floor(K - 273.15);
     }



     form.addEventListener('submit',(e) =>{
        e.preventDefault();

        const city = search.value;

        if(city){
            getWeatherByLocation(city)
        }


     });

     // Create raindrops and snowflakes once
const rainContainer = document.querySelector('.rain');
for (let i = 0; i < 20; i++) {
  const drop = document.createElement('div');
  drop.classList.add('drop');
  drop.style.left = `${i * 5}%`;
  rainContainer.appendChild(drop);
}

const snowContainer = document.querySelector('.snow');
for (let i = 0; i < 20; i++) {
  const flake = document.createElement('div');
  flake.classList.add('snowflake');
  flake.style.left = `${Math.random() * 100}%`;
  flake.style.animationDelay = `${Math.random() * 8}s`;
  snowContainer.appendChild(flake);
}

// Function to toggle animations based on weather code
function updateWeatherAnimation(weatherCode) {
  const sun = document.querySelector('.sun');
  const clouds = document.querySelector('.clouds');
  const rain = document.querySelector('.rain');
  const snow = document.querySelector('.snow');

  sun.style.display = 'none';
  clouds.style.display = 'none';
  rain.style.display = 'none';
  snow.style.display = 'none';

  if (weatherCode === 800) {
    sun.style.display = 'block'; // Clear sky
  } else if (weatherCode >= 801 && weatherCode < 900) {
    clouds.style.display = 'flex'; // Cloudy
  } else if (weatherCode >= 300 && weatherCode < 600) {
    rain.style.display = 'flex'; // Rain
  } else if (weatherCode >= 600 && weatherCode < 700) {
    snow.style.display = 'block'; // Snow
  }
}

// Modify addWeatherToPage to call updateWeatherAnimation
function addWeatherToPage(data){
  const temp = Ktoc(data.main.temp);

  const weather = document.createElement('div')
  weather.classList.add('weather');

  weather.innerHTML = `
    <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
    <small>${data.weather[0].main}</small>
  `;

  // Clear previous content except weather-animation container
  main.innerHTML = "";
  main.appendChild(weather);

  // Append weather-animation container if missing
  let animationContainer = document.querySelector('.weather-animation');
  if (!animationContainer) {
    animationContainer = document.createElement('div');
    animationContainer.classList.add('weather-animation');
    animationContainer.innerHTML = `
      <div class="sun"></div>
      <div class="clouds">
        <div class="cloud"></div>
        <div class="cloud"></div>
      </div>
      <div class="rain"></div>
      <div class="snow"></div>
    `;
    main.appendChild(animationContainer);

    // Create raindrops and snowflakes inside new container
    const rainContainer = animationContainer.querySelector('.rain');
    for (let i = 0; i < 20; i++) {
      const drop = document.createElement('div');
      drop.classList.add('drop');
      drop.style.left = `${i * 5}%`;
      rainContainer.appendChild(drop);
    }
    const snowContainer = animationContainer.querySelector('.snow');
    for (let i = 0; i < 20; i++) {
      const flake = document.createElement('div');
      flake.classList.add('snowflake');
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.animationDelay = `${Math.random() * 8}s`;
      snowContainer.appendChild(flake);
    }
  }

  // Update animation based on weather code
  updateWeatherAnimation(data.weather[0].id);
}
