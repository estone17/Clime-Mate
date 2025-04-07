const API_KEY = '66e860199c0f6438c737b4997bf7ba6d';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getFeelsLikeTemperature(city = null, lat = null, lon = null) {
    let weatherUrl;

    if (lat !== null && lon !== null) {
        // Fetch weather by coordinates (Geolocation)
        weatherUrl = `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
    } else if (city) {
        // Fetch weather by city name
        weatherUrl = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`;
    } else {
        console.error('No valid location provided for weather data.');
        return;
    }

    console.log('Fetching weather data from:', weatherUrl); // Debug log

    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        console.log('API Response:', data); // Debug log

        if (response.ok) {
            if (data.main && data.main.feels_like !== undefined) {
                const feelsLikeTemp = Math.round(data.main.feels_like);
                const showFeelsLike = localStorage.getItem('showFeelsLike') === 'true'; // Check setting
                if (showFeelsLike) {
                    document.getElementById('feels-like').innerText = `Feels Like: ${feelsLikeTemp}°F`;
                } else {
                    document.getElementById('feels-like').innerText = ''; // Clear if setting is off
                }
            } else {
                console.error('Unexpected API response format:', data);
                document.getElementById('feels-like').innerText = 'Error: Unable to fetch "Feels Like" temperature.';
            }
        } else {
            console.error('Error fetching "Feels Like" temperature:', data.message);
            document.getElementById('feels-like').innerText = `Error: ${data.message}`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('feels-like').innerText = 'Error: Unable to fetch weather data.';
    }
}

// Update temperature based on city input
function updateFeelsLike() {
    const city = document.getElementById('city')?.value.trim();
    if (city) {
        getFeelsLikeTemperature(city);
    } else {
        console.error('Please enter a valid city name.');
    }
}

// Update temperature based on geolocation
function updateFeelsLikeByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getFeelsLikeTemperature(null, lat, lon);
            },
            (error) => {
                console.error('Error getting geolocation:', error.message);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}


//function exports
module.exports = {getFeelsLikeTemperature, updateFeelsLikeByGeolocation, updateFeelsLike}