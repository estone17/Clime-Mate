// Function to get weather based on city name
function getWeather() {
    const apiKey = '66e860199c0f6438c737b4997bf7ba6d';
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city');
        return;
    }

    console.log('Fetching weather for city:', city); // Debug log

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Current Weather API Response:', data); // Debug log
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Forecast API Response:', data); // Debug log
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });

    updateFeelsLike(); // Ensure this function is called
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

    updateFeelsLikeByGeolocation(); // Added call to update "Feels Like" temperature using geolocation
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

        const feelsLikeTemp = Math.round(data.main.feels_like);
        const showFeelsLike = localStorage.getItem('showFeelsLike') === 'true'; // Check setting
        if (showFeelsLike) {
            document.getElementById('feels-like').innerText = `Feels Like: ${feelsLikeTemp}°F`;
        } else {
            document.getElementById('feels-like').innerText = ''; // Clear if setting is off
        }

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

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}

function displayWeatherAlerts(alerts) {
    const alertsDiv = document.getElementById('weather-alerts');
    alertsDiv.innerHTML = ''; // Clear previous alerts

    if (!alerts || alerts.length === 0) {
        alertsDiv.innerHTML = '<p>No weather alerts.</p>';
        return;
    }
}