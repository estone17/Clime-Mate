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
  
// Function to display weather information
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

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

        showImage();
    }
}
  
// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
  
    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)
  
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
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
