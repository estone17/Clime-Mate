// Function to get weather based on city name
function getWeather() {
    const apiKey = '66e860199c0f6438c737b4997bf7ba6d';
    const city = document.getElementById('city').value;
  
    if (!city) {
        alert('Please enter a city');
        return;
    }
  
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });
  
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}
  
// Function to get weather based on geolocation (current location)
function getWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '66e860199c0f6438c737b4997bf7ba6d';
  
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  
            fetch(currentWeatherUrl)
                .then(response => response.json())
                .then(data => {
                    displayWeather(data);
                })
                .catch(error => {
                    console.error('Error fetching current weather data:', error);
                    alert('Error fetching current weather data. Please try again.');
                });
  
            fetch(forecastUrl)
                .then(response => response.json())
                .then(data => {
                    displayHourlyForecast(data.list);
                })
                .catch(error => {
                    console.error('Error fetching hourly forecast data:', error);
                    alert('Error fetching hourly forecast data. Please try again.');
                });
        }, function(error) {
            alert('Geolocation error: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
 
// Function to calculate the time until the next event (sunrise or sunset)
function getTimeUntil(eventTime, currentTime) {
    const timeDifference = eventTime - currentTime; // Time difference in milliseconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert to hours
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes
    return `${hours}h ${minutes}m`; // Return formatted time
}

// Function to determine the upcoming event (sunrise or sunset)
function getUpcomingEvent(sunriseTime, sunsetTime, currentTime) {
    if (currentTime < sunriseTime) {
        return {
            name: "Sunrise",
            timeUntil: getTimeUntil(sunriseTime, currentTime)
        };
    } else if (currentTime < sunsetTime) {
        return {
            name: "Sunset",
            timeUntil: getTimeUntil(sunsetTime, currentTime)
        };
    } else {
        // Ensure next day's sunrise is used (add 24 hours in ms)
        const nextDaySunrise = new Date(sunriseTime);
        nextDaySunrise.setDate(nextDaySunrise.getDate() + 1);
        return {
            name: "Sunrise (next day)",
            timeUntil: getTimeUntil(nextDaySunrise.getTime(), currentTime)
        };
    }
}


// Function to display weather information
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const detailsContent = document.getElementById('details-content');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
  
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Convert sunrise and sunset
        const sunriseTime = new Date(data.sys.sunrise * 1000);
        const sunsetTime = new Date(data.sys.sunset * 1000);

        const sunrise = sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunset = sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

         // Calculate time until sunrise and sunset
         const currentTime = new Date();
         const timeUntilSunrise = getTimeUntil(sunriseTime, currentTime);
         const timeUntilSunset = getTimeUntil(sunsetTime, currentTime);
 

        const temperatureHTML = `
            <p>${temperature}°F</p>
        `;
  
        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;
  
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        
        // Set the weather icon URL
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        
        // Make the weather icon visible after data is loaded
        weatherIcon.style.display = 'block';

        const sunriseHTML = `<p>🌞 Sunrise: ${sunrise}</p>`;
        const sunsetHTML = `<p>🌙 Sunset: ${sunset}</p>`;

        const upcomingEvent = getUpcomingEvent(sunriseTime, sunsetTime, currentTime);
        detailsContent.innerHTML = `
            ${sunriseHTML}
            ${sunsetHTML}
            <p>Upcoming: ${upcomingEvent.name}</p>
            <p>Time until next event: ${upcomingEvent.timeUntil}</p>
        `;

        // Make the "More Details" button visible only after loading weather
        const detailsButton = document.getElementById('toggle-details-btn');
        detailsButton.style.display = 'inline-block';

        // Also hide the details section again, just in case it's still showing from last time
        document.getElementById('details-content').style.display = 'none';
        detailsButton.textContent = 'More Details';

        showImage();
    }
}
  
// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
  
    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)
  
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hourFormatted = dateTime.toLocaleTimeString([], { hour: '2-digit', hour12: true });
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hourFormatted}</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°F</span>
            </div>
        `;
  
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

// Converts Fahrenheit to Celsius
function convertFahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
  }
  
  // Converts Celsius to Fahrenheit
  function convertCelsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
  }
  
  // Example conversion for wind speed (km/h <-> mph)
  function convertMphToKmh(mph) {
    return mph / 0.621371;
  }
  
  function convertKmhToMph(kmh) {
    return kmh * 0.621371;
  }
  
  
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}

function toggleDetails() {
    const details = document.getElementById('details-content');
    const button = document.getElementById('toggle-details-btn');
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        button.textContent = 'Hide Details';
    } else {
        details.style.display = 'none';
        button.textContent = 'More Details';
    }
}

// Export the functions
module.exports = {
    getTimeUntil,
    getUpcomingEvent
};