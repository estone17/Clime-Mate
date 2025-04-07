

/*Un comment this to get test cases to work */
//const {translateText, formatTemperature, convertTemperature, applyTranslations, saveSettings, initSettings} = require('../javascript/settings.js');


const weatherAlert = document.getElementById('weather-alert');
//const searchBar = document.getElementById('searchbar');
//const dropdown = document.getElementById('drop1');
//weatherInfo.classList.remove('map-disabled')

const latitude = document.getElementById('lat');
const longitude = document.getElementById('lon');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weather-container');
const todayContainer = document.getElementById('today-container');



if (searchBtn){
    searchBtn.addEventListener('click', async function(event){

        if(latitude.value.length === 0 || longitude.value.length === 0){
            weatherAlert.classList.remove('hidden');
            return;
        }
        
        
    
       const weatherData = await fetchWeatherData(latitude.value, longitude.value);
       
       if(weatherData === null){
            weatherAlert.classList.remove('hidden');
            todayContainer.classList.add('hidden');
            return;
       }
    
       weatherAlert.classList.add('hidden');
       todayContainer.classList.remove('hidden');
    
       weatherContainer.innerHTML = '';
    
       for(i = 0; i <7; i++){
        newHigh = convertTemperature(parseInt(weatherData.daily.temperature_2m_max[i]));
        newLow = convertTemperature(parseInt(weatherData.daily.temperature_2m_min[i]));
    
    
        // Get the original temperature in Celsius for weather icon determination
        const originalHighTemp = parseInt(weatherData.daily.temperature_2m_max[i]);
        
        if(weatherData.daily.snowfall_sum[i] > 10){
            if(i == 0){
                const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/snowflake.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
                todayContainer.innerHTML = ''; // Clear previous content
                todayContainer.appendChild(todayCard);
            }
    
            weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/snowflake.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]));
            console.log("test 1");
    
        }
        else if(weatherData.daily.rain_sum[i] > 40){
            if(i == 0){
                const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/rainy.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
                todayContainer.innerHTML = ''; // Clear previous content
                todayContainer.appendChild(todayCard);
            }
    
            weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/rainy.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]));
            console.log("test 2");
        }
        // Use the original Celsius temperature for icon determination
        else if (originalHighTemp >= 21){ // 21°C ≈ 70°F
            if(i == 0){
                const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/sun.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
                todayContainer.innerHTML = ''; // Clear previous content
                todayContainer.appendChild(todayCard);
            }
    
            weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/sun.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]));
            console.log("test 3");
        }
        else if(originalHighTemp < 21 && originalHighTemp > 4){ // 4°C ≈ 40°F, 21°C ≈ 70°F
            if(i == 0){
                const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/semi-cloudy-day.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
                todayContainer.innerHTML = ''; // Clear previous content
                todayContainer.appendChild(todayCard);
            }
    
            weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/semi-cloudy-day.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]));
            console.log("test 4");
        }
        else{
            if(i == 0){
                const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/cloudy-day.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
                todayContainer.innerHTML = ''; // Clear previous content
                todayContainer.appendChild(todayCard);
            }
    
            weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/cloudy-day.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]));
            console.log("test 5");
        }
    
       }
    
    
        
        
    
    });
}




async function fetchWeatherData(lat, lon){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum,sunrise,sunset&timezone=auto&forecast_days=7`;

    console.log(url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Log the weather data
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}




function createWeatherCard(date, iconSrc, highTemp, lowTemp, rainSum, snowSum, sunrise, sunset) {
    // Create the main card div
    const card = document.createElement("div");
    card.className = "card text-center";
    card.style.width = "12rem";
    card.style.minHeight = "20rem";

    // Create the card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Create the date title
    const dateTitle = document.createElement("h5");
    dateTitle.className = "card-title";
    dateTitle.innerText = date;

    // Underline the date
    const underlineDate = document.createElement("u");
    underlineDate.appendChild(dateTitle);

    // Create the weather icon
    const icon = document.createElement("img");
    icon.src = iconSrc;
    icon.alt = "Weather Icon";

    // Create the temperature info
    const tempText = document.createElement("p");
    tempText.className = "card-text card-margin";
    tempText.innerHTML = `<u>${translateText('high')}: ${formatTemperature(highTemp)} | ${translateText('low')}: ${formatTemperature(lowTemp)}</u>`;

    // Create the rain summary
    const rainText = document.createElement("p");
    rainText.className = "card-text card-margin";
    rainText.innerText = `${translateText('rainSum')}: ${rainSum}%`;

    // Create the snow summary
    const snowText = document.createElement("p");
    snowText.className = "card-text card-margin";
    snowText.innerText = `${translateText('snowSum')}: ${snowSum}%`;

    // Create the sunrise time
    const sunriseText = document.createElement("p");
    sunriseText.className = "card-text card-margin";
    sunriseText.innerText = `${translateText('sunrise')}: ${sunrise}`;

    // Create the sunset time
    const sunsetText = document.createElement("p");
    sunsetText.className = "card-text card-margin";
    sunsetText.innerText = `${translateText('sunset')}: ${sunset}`;

    // Append all elements to the card body
    cardBody.appendChild(underlineDate);
    cardBody.appendChild(icon);
    cardBody.appendChild(tempText);
    cardBody.appendChild(rainText);
    cardBody.appendChild(snowText);
    cardBody.appendChild(sunriseText);
    cardBody.appendChild(sunsetText);

    // Append card body to the main card div
    card.appendChild(cardBody);

    return card;
}




function createTodayWeatherCard(date, iconSrc, highTemp, lowTemp, rainSum, snowSum, sunrise, sunset) {
    const card = document.createElement("div");
    card.className = "today-card text-center mb-3";
    card.style.width = "100%";
    // Remove hardcoded styling to respect theme
    card.style.padding = "1rem";
    card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h4");
    title.className = "card-title font-weight-bold";
    // Use translated text for "Today's Weather"
    const todayText = translateText('home') === 'Home' ? "Today's Weather" : 
                      translateText('home') === 'Inicio' ? "El Clima de Hoy" :
                      translateText('home') === 'Accueil' ? "Météo d'Aujourd'hui" :
                      "Wetter Heute";
    title.innerText = `${todayText} – ${date}`;

    const icon = document.createElement("img");
    icon.src = iconSrc;
    icon.alt = "Weather Icon";
    icon.style.width = "80px";
    icon.style.height = "80px";

    const temp = document.createElement("p");
    temp.className = "card-text";
    temp.innerHTML = `<strong>${translateText('high')}:</strong> ${formatTemperature(highTemp)} | <strong>${translateText('low')}:</strong> ${formatTemperature(lowTemp)}`;

    const rain = document.createElement("p");
    rain.innerText = `${translateText('rainSum')}: ${rainSum}%`;

    const snow = document.createElement("p");
    snow.innerText = `${translateText('snowSum')}: ${snowSum}%`;

    const rise = document.createElement("p");
    rise.innerText = `${translateText('sunrise')}: ${sunrise}`;

    const set = document.createElement("p");
    set.innerText = `${translateText('sunset')}: ${sunset}`;

    cardBody.appendChild(title);
    cardBody.appendChild(icon);
    cardBody.appendChild(temp);
    cardBody.appendChild(rain);
    cardBody.appendChild(snow);
    cardBody.appendChild(rise);
    cardBody.appendChild(set);

    card.appendChild(cardBody);

    return card;
}






//function exports
module.exports = {createTodayWeatherCard, createWeatherCard, fetchWeatherData}