const API_KEY = '66e860199c0f6438c737b4997bf7ba6d';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Constants for localStorage keys (matching the main app)
const TEMP_UNIT_KEY = 'clime-mate-temp-unit';
const LANGUAGE_KEY = 'clime-mate-language';

// Function to get the user's temperature unit preference
function getTemperatureUnit() {
    return localStorage.getItem(TEMP_UNIT_KEY) || 'fahrenheit';
}

// Function to get the API units parameter based on temperature preference
function getUnitsParameter() {
    const tempUnit = getTemperatureUnit();
    return tempUnit === 'celsius' ? 'metric' : 'imperial';
}

// Function to format temperature with the appropriate unit symbol
function formatTemperature(temp) {
    const unit = getTemperatureUnit();
    const roundedTemp = Math.round(temp);
    
    if (unit === 'celsius') {
        return `${roundedTemp}°C`;
    } else {
        return `${roundedTemp}°F`;
    }
}

// Function to translate text based on user preference
function translateText(key) {
    // Simple translations for "Feels Like" text
    const translations = {
        feelsLike: {
            en: "Feels Like",
            es: "Sensación Térmica",
            fr: "Ressenti",
            de: "Gefühlt Wie"
        },
        error: {
            en: "Error",
            es: "Error",
            fr: "Erreur",
            de: "Fehler"
        },
        errorFetchingFeelsLike: {
            en: "Unable to fetch \"Feels Like\" temperature.",
            es: "No se puede obtener la temperatura de \"Sensación Térmica\".",
            fr: "Impossible d'obtenir la température \"Ressenti\".",
            de: "Die \"Gefühlt Wie\"-Temperatur konnte nicht abgerufen werden."
        },
        errorFetchingWeather: {
            en: "Unable to fetch weather data.",
            es: "No se pueden obtener datos meteorológicos.",
            fr: "Impossible d'obtenir les données météo.",
            de: "Wetterdaten konnten nicht abgerufen werden."
        }
    };
    
    const language = localStorage.getItem(LANGUAGE_KEY) || 'en';
    
    if (translations[key] && translations[key][language]) {
        return translations[key][language];
    }
    
    // Fallback to English if translation not found
    return translations[key]?.en || key;
}

async function getFeelsLikeTemperature(city = null, lat = null, lon = null) {
    let weatherUrl;
    const units = getUnitsParameter();

    if (lat !== null && lon !== null) {
        // Fetch weather by coordinates (Geolocation)
        weatherUrl = `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
    } else if (city) {
        // Fetch weather by city name
        weatherUrl = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`;
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
                const feelsLikeTemp = data.main.feels_like;
                const showFeelsLike = localStorage.getItem('showFeelsLike') === 'true'; // Check setting
                if (showFeelsLike) {
                    document.getElementById('feels-like').innerText = `${translateText('feelsLike')}: ${formatTemperature(feelsLikeTemp)}`;
                } else {
                    document.getElementById('feels-like').innerText = ''; // Clear if setting is off
                }
            } else {
                console.error('Unexpected API response format:', data);
                document.getElementById('feels-like').innerText = `${translateText('error')}: ${translateText('errorFetchingFeelsLike')}`;
            }
        } else {
            console.error('Error fetching "Feels Like" temperature:', data.message);
            document.getElementById('feels-like').innerText = `${translateText('error')}: ${data.message}`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('feels-like').innerText = `${translateText('error')}: ${translateText('errorFetchingWeather')}`;
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
