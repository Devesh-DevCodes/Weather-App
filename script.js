const cityInput = document.getElementById("cityVal");
const displayTodaysDetails = document.getElementById("display-todays-weather");
const displayForecastDetails = document.getElementById("display-forecast-weather");
const btnSearchWeather = document.getElementById("btn-check-weather");
const API_key = "d747ebbef652723004a923baeb7230a4";
const weatherIconMap = {
  "01d": "./assets/sunny.png",   // clear sky day
  "01n": "./assets/sunny.png",   // clear sky night (you can add moon icon if you have one)
  "02d": "./assets/cloudy.png",  // few clouds day
  "02n": "./assets/night-cloudy.png",  // few clouds night
  "03d": "./assets/cloud.png",  // scattered clouds
  "03n": "./assets/cloudy.png",
  "04d": "./assets/cloudy.png",  // broken clouds
  "04n": "./assets/cloudy.png",
  "09d": "./assets/rain.png",    // shower rain
  "09n": "./assets/rain.png",
  "10d": "./assets/rain.png",    // rain
  "10n": "./assets/rain.png",
  "11d": "./assets/thunder.png", // thunderstorm
  "11n": "./assets/thunder.png",
  "13d": "./assets/snow.png",    // snow
  "13n": "./assets/snow.png",
  "50d": "./assets/fog.png",     
  "50n": "./assets/fog.png"
};


// Event Listener on search button
btnSearchWeather.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
  const cityName = cityInput.value.trim();
  if (!cityName) {
    displayTodaysDetails.innerHTML = `
            <p style="color : red; background-color : yellow; max-width:fit-content;">⚠️ Please Enter City Name</p>
        `;
    displayForecastDetails.innerHTML = "";
    // displayForecastDetails.style.display = "none";
    displayForecastDetails.classList.remove("active");
    cityInput.focus(); // After error (empty input or invalid city),auto-focus back on the input field
    return; // stop further execution
  }
  // Call both functions only if valid city
  getCurrentWeather(cityName);
  getForecastDetails(cityName); // only fetch if city exists
});

// Function to Fetch current weather  details
async function getCurrentWeather(cityName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`;
  try {
    const res = await fetch(url);
    const todaysData = await res.json();
    if (parseInt(todaysData.cod) !== 200) {
      displayTodaysDetails.innerHTML = `
                <p style="color : red; background-color : yellow; max-width:fit-content;">❌ City Not Found, Please Enter Valid City</p>
            `;
      cityInput.focus(); // After error (empty input or invalid city),auto-focus back on the input field
      return ;
    } else {
        displayTodaysDetails.classList.add("active");
        displayForecastDetails.classList.remove("active");
        const currDate = new Date(todaysData.dt*1000).toLocaleString("en-IN", { weekday: 'short', day: 'numeric', month: 'short' , hour:'numeric',minute:'numeric',hour12:true}).toUpperCase();;
        // console.log(currDate);
        const iconCode = todaysData.weather[0].icon;
        const iconUrl = weatherIconMap[iconCode] || "./assets/cloudy.png";

        displayTodaysDetails.innerHTML = `
        <div class="todaysDate"> ${currDate}</div>
        <div class="main-weather">
            <div class="inside-main-weather">
              <div class="temp">
                <span>${(todaysData.main.temp).toFixed(1)}</span><span>°C</span> 
              </div>
              <div class="feelsLike">
                <span>Feels Like :</span>
                <span>${todaysData.main.feels_like.toFixed(1)}°C</span>
              </div>
            </div>
            <div class="inside-main-weather">
              <img src="${iconUrl}" alt="Weather: ${todaysData.weather[0].main}" class="weatherStatus-img" />
              <div class="weatherStatus">
                <span>Weather :</span>
                <span>${todaysData.weather[0].main}</span>
                <span>${todaysData.weather[0].description}</span>
              </div>
            </div>
        </div>
        <div class="sub-weather">
            <h3>Other Details</h3>
            <table class="sub-weather-table">
              <tr>
                <td>💧 Humidity</td>
                <td>${todaysData.main.humidity} %</td>
              </tr>
              <tr>
                <td>🌡 Pressure</td>
                <td>${todaysData.main.pressure} mBar</td>
              </tr>
              <tr>
                <td>👁 Visibility</td>
                <td>${(todaysData.visibility / 1000).toFixed(1)} Km</td>
              </tr>
              <tr>
                <td>💨 Wind Speed</td>
                <td>${(todaysData.wind.speed * 3.6).toFixed(1)} Km/h</td>
              </tr>
              <tr>
                <td>🌅 Sunrise</td>
                <td>${formatTime(todaysData.sys.sunrise)}</td>
              </tr>
              <tr>
                <td>🌇 Sunset</td>
                <td>${formatTime(todaysData.sys.sunset)}</td>
              </tr>
            </table>
        </div>
        <div class="rainPercnt"></div>
            `;

    }
  } catch (error) {
    displayTodaysDetails.innerHTML = `
            <p style="color : red; background-color : yellow; max-width:fit-content;">Error : ${error.message}</p>
        `;
    return;
  }
}

/*
flow of checkWeather() function
checkWeather() {
    1. If input is empty → show warning → return.
    2. Fetch API data.
    3. If API response.cod != 200 → show error message.
    4. Else → display weather details.
    }
    */

// document.getElementById('cityVal').addEventListener('input', ()=>{
//     console.log(city.value);
// });

// Function to display forecast weather details
async function getForecastDetails(cityName) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_key}&units=metric`;
  try {
    const res = await fetch(url);
    const forecastData = await res.json();

    if (parseInt(forecastData.cod) !== 200) {
      displayForecastDetails.innerHTML = `
          <p style="color : red; background-color : yellow; max-width:fit-content;">❌ City Not Found, Please Enter Valid City</p>
      `
      cityInput.focus(); // After error (empty input or invalid city),auto-focus back on the input field
      return;
    }

    // console.log(forecastData);
    // displayForecastDetails.style.display = "block";
    displayForecastDetails.classList.remove("active");
    let listData = forecastData.list;
    let dailySummary = processDailySummary(listData); // array of summary objects
    console.log(dailySummary);
    // 0 : {date: '2025-08-31', avgTemp: '27.69', minTemp: '25.06', maxTemp: '30.86', avgFeelsLike: '30.73', …}

    displayForecastDetails.innerHTML = "";
    for (let dailyData of dailySummary) {
      // console.log(listData[i]);
      let date = new Date(dailyData.date).toLocaleString("en-IN",{day:"numeric",weekday:"short", month:"short"});
      let temp = dailyData.avgTemp;
      let minTemp = dailyData.minTemp;
      let maxTemp = dailyData.maxTemp;
      let feelsLike = dailyData.avgFeelsLike;
      let weatherStatus = dailyData.mainWeather[0];
      let weatherStatusCode = dailyData.mainWeather[1];
      let humidity = dailyData.avgHumidity;
      let wind = dailyData.avgWind;
      let rainPercnt = dailyData.rainChance;

      let iconUrl = weatherIconMap[weatherStatusCode];
    //   let iconUrl = `https://openweathermap.org/img/wn/${weatherStatusCode}@2x.png`;
    
      displayForecastDetails.innerHTML += `
            <div class="forecast-card">
              <div class="fc-left">
                <div class="date">${date}</div>
                <div class="temp">${temp}°C</div>
              </div>
              
              <div class="fc-middle">
                <div>
                  <span class="rainPercnt">${parseFloat(rainPercnt) * 100}%</span>
                  <img src="${iconUrl}" alt="${weatherStatus}" class="w-img">
                </div>
                <div class="weatherStatus">${weatherStatus}</div>
              </div>

              <div class="fc-right">
                <div class="maxTemp">${maxTemp}°</div>
                <div class="minTemp">${minTemp}°</div>
              </div>
            </div>
            `;
    }
  } catch (error) {
    displayForecastDetails.innerHTML = `
        <p style="color : red; background-color : yellow; max-width:fit-content;">Error : ${error.message}</p>
    `
    console.error(error);
  }
}

// function tp Group by Daily data for forecasting Daily Summary
function processDailySummary(listData) {
  // Step 1 : grouping each day data
  const dailyData = {};
  listData.forEach((entry) => {
    // Extract only the date part from dt_txt
    const date = entry.dt_txt.split(" ")[0]; // "2023-08-28"
    if (!dailyData[date]) {
      // if date not present in dailyData -> create new entry for that date
      dailyData[date] = {
        temps: [],
        feelsLike: [],
        weatherConditions: [],
        rainChances: [],
        humidity: [],
        visibility: [],
        wind: [],
      };
    }
    dailyData[date].temps.push(entry.main.temp);
    dailyData[date].feelsLike.push(entry.main.feels_like);
    dailyData[date].weatherConditions.push({
      main: entry.weather[0].main,
      description: entry.weather[0].description,
      icon: entry.weather[0].icon
    });
    dailyData[date].humidity.push(entry.main.humidity);
    dailyData[date].visibility.push(entry.visibility);
    dailyData[date].wind.push(entry.wind.speed);

    // if rain probability is present
    if (entry.pop !== undefined) {
      dailyData[date].rainChances.push(entry.pop);
    }
  });
  console.log(dailyData);

  // Step 2 : Calculating grouped data into daily summary
  const dailySummary = [];
  for (let [date, data] of Object.entries(dailyData)) {

    dailySummary.push({
      date,
      avgTemp: avg(data.temps).toFixed(2),
      minTemp: Math.min(...data.temps).toFixed(2),
      maxTemp: Math.max(...data.temps).toFixed(2),
      avgFeelsLike: avg(data.feelsLike).toFixed(2),
      mainWeather: mostCommonElement(data.weatherConditions),
      avgHumidity: avg(data.humidity).toFixed(2),
      avgWind: avg(data.wind).toFixed(2),
      rainChance: data.rainChances.length ? Math.max(...data.rainChances) : 0,
    });
  }
  // console.log(dailySummary)
  return dailySummary;
  // {date: '2025-08-31', avgTemp: '27.69', minTemp: '25.06', maxTemp: '30.86', avgFeelsLike: '30.73', …}
}

// function to format time
function formatTime(unixTime) {
  // in sec
  // time*1000 -> to get in millisec
  //Easiest way, handles AM/PM automatically.
  return new Date(unixTime * 1000)
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toUpperCase();
}
// helper Function to calculate average
const avg = (arr) => {
    if (arr.length === 0) return 0;
    let sum = 0;
    for (let x of arr) {
        sum += x;
    }
    return sum / arr.length;
};

// helper function to find most common element
mostCommonElement = (arr) => {
  let countMap = {};
  let iconMap={};
  for (let x of arr) {
    // count freq of main weather condition
    countMap[x.main] = countMap[x.main] ? countMap[x.main] + 1 : 1;

    // track icon
    iconMap[x.main]=x.icon;
  }

  let maxCount = 0;
  let mostCommonMain = null;

  for (let [element, count] of Object.entries(countMap)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonMain = element;
    }
  }
  let mostCommonIcon = iconMap[mostCommonMain];

  return [mostCommonMain,mostCommonIcon];
};


// navigation
const navCurrentWeather = document.getElementById("nav-current-weather");
const navNext5Days = document.getElementById("nav-next-5days");

navCurrentWeather.addEventListener("click", () => {
  // toggle sections
  displayTodaysDetails.classList.add("active");
  displayForecastDetails.classList.remove("active");

  // toggle button states (optional, for styling)
  navCurrentWeather.classList.add("active");
  navNext5Days.classList.remove("active");
});

navNext5Days.addEventListener("click", () => {
  // toggle sections
  displayTodaysDetails.classList.remove("active");
  displayForecastDetails.classList.add("active");

  // toggle button states
  navCurrentWeather.classList.remove("active");
  navNext5Days.classList.add("active");

});


