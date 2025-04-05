//event listener for the anchor
/*anch.addEventListener('click', function(event) {
    event.preventDefault();
    const parkData = {
      title: title,
      address: address,
      description: description,
      imgSrc: imgSrc,
      imgAlt: imgAlt
  };
  localStorage.setItem('selectedPark', JSON.stringify(parkData));
  window.location.href = anch.href;
  });
  */

const weatherAlert = document.getElementById('weather-alert');
//const searchBar = document.getElementById('searchbar');
//const dropdown = document.getElementById('drop1');
//weatherInfo.classList.remove('map-disabled')

const latitude = document.getElementById('lat');
const longitude = document.getElementById('lon');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weather-container');
const todayContainer = document.getElementById('today-container');



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
    newHigh = (parseInt(weatherData.daily.temperature_2m_max[i])* 9/5) + 32;
    newLow = (parseInt(weatherData.daily.temperature_2m_min[i])* 9/5) + 32;


    if(weatherData.daily.snowfall_sum[i] > 10){
        if(i == 0){
            const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/snowflake.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
            todayContainer.appendChild(todayCard)
        }

        weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/snowflake.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]))
        console.log("test 1");

    }
    else if(weatherData.daily.rain_sum[i] > 40){
        if(i == 0){
            const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/rainy.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
            todayContainer.appendChild(todayCard)
        }

        weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/rainy.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]))
        console.log("test 2");
    }
    else if (newHigh >= 70){
        if(i == 0){
            const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/sun.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
            todayContainer.appendChild(todayCard)
        }

        weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/sun.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]))
        console.log("test 3");
    }
    else if(newHigh < 70 && newHigh > 40){
        if(i == 0){
            const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/semi-cloudy-day.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
            todayContainer.appendChild(todayCard)
        }

        weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/semi-cloudy-day.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]))
        console.log("test 4");
    }
    else{
        if(i == 0){
            const todayCard = createTodayWeatherCard(weatherData.daily.time[0],"images/icons/cloudy-day.png",newHigh,newLow,weatherData.daily.rain_sum[0],weatherData.daily.snowfall_sum[0],weatherData.daily.sunrise[0].split("T")[1],weatherData.daily.sunset[0].split("T")[1]);
            todayContainer.insertBefore(todayCard, weatherContainer);
        }

        weatherContainer.appendChild(createWeatherCard(weatherData.daily.time[i], "images/icons/cloudy-day.png", newHigh, newLow, weatherData.daily.rain_sum[i] , weatherData.daily.snowfall_sum[i], weatherData.daily.sunrise[i].split('T')[1], weatherData.daily.sunset[i].split('T')[1]))
        console.log("test 5");
    }

   }


    
    

});


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
    tempText.innerHTML = `<u>High: ${highTemp} | Low: ${lowTemp}</u>`;

    // Create the rain summary
    const rainText = document.createElement("p");
    rainText.className = "card-text card-margin";
    rainText.innerText = `Rain Sum: ${rainSum}%`;

    // Create the snow summary
    const snowText = document.createElement("p");
    snowText.className = "card-text card-margin";
    snowText.innerText = `Snow Sum: ${snowSum}%`;

    // Create the sunrise time
    const sunriseText = document.createElement("p");
    sunriseText.className = "card-text card-margin";
    sunriseText.innerText = `Sunrise: ${sunrise}`;

    // Create the sunset time
    const sunsetText = document.createElement("p");
    sunsetText.className = "card-text card-margin";
    sunsetText.innerText = `Sunset: ${sunset}`;

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
    card.className = "card text-center mb-3";
    card.style.width = "100%";
    card.style.backgroundColor = "#f0f8ff";
    card.style.border = "2px solid #007bff";
    card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    card.style.padding = "1rem";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h4");
    title.className = "card-title font-weight-bold";
    title.innerText = `Today's Weather – ${date}`;

    const icon = document.createElement("img");
    icon.src = iconSrc;
    icon.alt = "Weather Icon";
    icon.style.width = "80px";
    icon.style.height = "80px";

    const temp = document.createElement("p");
    temp.className = "card-text";
    temp.innerHTML = `<strong>High:</strong> ${highTemp}°F | <strong>Low:</strong> ${lowTemp}°F`;

    const rain = document.createElement("p");
    rain.innerText = `Rain: ${rainSum}%`;

    const snow = document.createElement("p");
    snow.innerText = `Snow: ${snowSum}%`;

    const rise = document.createElement("p");
    rise.innerText = `Sunrise: ${sunrise}`;

    const set = document.createElement("p");
    set.innerText = `Sunset: ${sunset}`;

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






// searchBar.addEventListener('input',function(event){
//     if(searchBar.value.length === 0){
        
//     }
//     else{
//         const data = fetchCityData(searchBar.value);
//         dropdown.textContent = data[0];
//         console.log(data[0])
//     }
// });




/*async function fetchCityData(cityName) {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const query = `
        [out:json];
        area["ISO3166-1"="US"]->.searchArea;
        node["place"="city"]["name"~"${cityName}", i](area.searchArea);
        out body;
    `;

    try {
        // Make a POST request to the Overpass API
        const response = await fetch(overpassUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `data=${encodeURIComponent(query)}`,
        });

        const data = await response.json();

        if (data.elements.length === 0) {
            console.log("No cities found.");
            return [];
        }

        // Extract city information
        const cities = data.elements.map(city => ({
            name: city.tags.name,
            state: city.tags["is_in:state"] || "Unknown",
            lat: city.lat,
            lon: city.lon
        }));

        console.log(cities); // Logs city details
        return cities;
    } catch (error) {
        console.error("Error fetching city data:", error);
        return [];
    }
}

// Example usage (replace "Charlotte" with any user input)
fetchCityData("Charlotte");*/
