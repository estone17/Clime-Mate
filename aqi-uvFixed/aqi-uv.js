const API_KEY = '66e860199c0f6438c737b4997bf7ba6d';

// Update temperature based on city input
function updateTemperatureByCity(city) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`)
        .then(response => response.json().then(data => {
            if (!response.ok) throw new Error(data.message);
            return data.main.temp; // Kelvin
        }))
        .catch(error => {
            console.error('Error fetching temperature by city:', error);
            return null;
        });
}

// Update temperature based on geolocation
function updateTemperatureByGeolocation(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then(response => response.json().then(data => {
            if (!response.ok) throw new Error(data.message);
            return data.main.temp; // Kelvin
        }))
        .catch(error => {
            console.error('Error fetching temperature by geolocation:', error);
            return null;
        });
}

// Get AQI & UV data from Weatherbit.io API
function getAQIandUV(lat, lon) {
    if (!lat || !lon) {
        console.error('Latitude and longitude are required to fetch AQI and UV data.');
        return Promise.resolve(null);
    }

    const weatherbitApiKey = '11db04fedfef47a38aefad4afbc440c1';

    const aqiPromise = fetch(`https://api.weatherbit.io/v2.0/current/airquality?lat=${lat}&lon=${lon}&key=${weatherbitApiKey}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch AQI data');
            return response.json();
        })
        .then(data => data.data[0]?.aqi ?? 'N/A')
        .catch(error => {
            console.error('Error fetching AQI data:', error);
            return 'N/A';
        });

    const uvPromise = fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${weatherbitApiKey}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch UV data');
            return response.json();
        })
        .then(data => data.data[0]?.uv ?? 'N/A')
        .catch(error => {
            console.error('Error fetching UV data:', error);
            return 'N/A';
        });

    return Promise.all([aqiPromise, uvPromise])
        .then(([aqi, uv]) => ({ aqi, uv }))
        .catch(error => {
            console.error('Error fetching AQI and UV data:', error);
            return { aqi: 'N/A', uv: 'N/A' };
        });
}

module.exports = {
    updateTemperatureByCity,
    updateTemperatureByGeolocation,
    getAQIandUV
};