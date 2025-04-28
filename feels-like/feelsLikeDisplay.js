// Function to get weather based on city name
function getWeather() {
    const apiKey = '66e860199c0f6438c737b4997bf7ba6d';
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert(translateText('pleaseEnterCity'));
        return;
    }

    console.log('Fetching weather for city:', city); // Debug log

    // Use the units parameter based on temperature preference
    const units = getUnitsParameter();
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Current Weather API Response:', data); // Debug log
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert(translateText('errorFetchingData'));
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Forecast API Response:', data); // Debug log
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert(translateText('errorFetchingData'));
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

            // Use the units parameter based on temperature preference
            const units = getUnitsParameter();
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

            fetch(currentWeatherUrl)
                .then(response => response.json())
                .then(data => {
                    displayWeather(data);
                })
                .catch(error => {
                    console.error('Error fetching current weather data:', error);
                    alert(translateText('errorFetchingData'));
                });

            fetch(forecastUrl)
                .then(response => response.json())
                .then(data => {
                    displayHourlyForecast(data.list);
                })
                .catch(error => {
                    console.error('Error fetching hourly forecast data:', error);
                    alert(translateText('errorFetchingData'));
                });
        }, function(error) {
            alert(translateText('geolocationError') + ': ' + error.message);
        });
    } else {
        alert(translateText('geolocationNotSupported'));
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
            <p>${formatTemperature(temperature)}</p>
        `;

        // Translate weather description if applicable
        const translatedDescription = translateWeatherDescription(description);
        
        const weatherHtml = `
            <p>${cityName}</p>
            <p>${translatedDescription}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;

        // Set the weather icon URL
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        // Make the weather icon visible after data is loaded
        weatherIcon.style.display = 'block';

        const feelsLikeTemp = data.main.feels_like;
        const showFeelsLike = localStorage.getItem('showFeelsLike') === 'true'; // Check setting
        if (showFeelsLike) {
            document.getElementById('feels-like').innerText = `${translateText('feelsLike')}: ${formatTemperature(feelsLikeTemp)}`;
        } else {
            document.getElementById('feels-like').innerText = ''; // Clear if setting is off
        }

        showImage();
    }
}

// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous content
    
    // Add a translated title for the hourly forecast section
    const forecastTitle = document.createElement('h3');
    forecastTitle.className = 'forecast-title';
    forecastTitle.textContent = translateText('hourlyForecast');
    hourlyForecastDiv.appendChild(forecastTitle);

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
                <span>${formatTemperature(temperature)}</span>
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
        alertsDiv.innerHTML = `<p>${translateText('noWeatherAlerts')}</p>`;
        return;
    }
}

// Function to translate weather descriptions
function translateWeatherDescription(description) {
    const language = localStorage.getItem(LANGUAGE_KEY) || 'en';
    
    // If language is English or description is empty, return as is
    if (language === 'en' || !description) {
        return description;
    }
    
    // Common weather descriptions translations
    const weatherDescriptions = {
        // Clear conditions
        'clear sky': {
            es: 'cielo despejado',
            fr: 'ciel dégagé',
            de: 'klarer Himmel'
        },
        'sunny': {
            es: 'soleado',
            fr: 'ensoleillé',
            de: 'sonnig'
        },
        // Cloudy conditions
        'few clouds': {
            es: 'pocas nubes',
            fr: 'quelques nuages',
            de: 'wenige Wolken'
        },
        'scattered clouds': {
            es: 'nubes dispersas',
            fr: 'nuages épars',
            de: 'vereinzelte Wolken'
        },
        'broken clouds': {
            es: 'nubes rotas',
            fr: 'nuages fragmentés',
            de: 'aufgelockerte Bewölkung'
        },
        'overcast clouds': {
            es: 'nublado',
            fr: 'couvert',
            de: 'bedeckt'
        },
        'cloudy': {
            es: 'nublado',
            fr: 'nuageux',
            de: 'bewölkt'
        },
        // Rain conditions
        'light rain': {
            es: 'lluvia ligera',
            fr: 'pluie légère',
            de: 'leichter Regen'
        },
        'moderate rain': {
            es: 'lluvia moderada',
            fr: 'pluie modérée',
            de: 'mäßiger Regen'
        },
        'heavy rain': {
            es: 'lluvia intensa',
            fr: 'forte pluie',
            de: 'starker Regen'
        },
        'rain': {
            es: 'lluvia',
            fr: 'pluie',
            de: 'Regen'
        },
        'shower rain': {
            es: 'aguacero',
            fr: 'averses',
            de: 'Regenschauer'
        },
        // Snow conditions
        'light snow': {
            es: 'nevada ligera',
            fr: 'neige légère',
            de: 'leichter Schneefall'
        },
        'snow': {
            es: 'nieve',
            fr: 'neige',
            de: 'Schnee'
        },
        'heavy snow': {
            es: 'nevada intensa',
            fr: 'neige abondante',
            de: 'starker Schneefall'
        },
        // Thunderstorm conditions
        'thunderstorm': {
            es: 'tormenta',
            fr: 'orage',
            de: 'Gewitter'
        },
        // Mist/fog conditions
        'mist': {
            es: 'neblina',
            fr: 'brume',
            de: 'Nebel'
        },
        'fog': {
            es: 'niebla',
            fr: 'brouillard',
            de: 'Nebel'
        },
        'haze': {
            es: 'calima',
            fr: 'brume sèche',
            de: 'Dunst'
        },
        // Additional weather conditions
        'drizzle': {
            es: 'llovizna',
            fr: 'bruine',
            de: 'Nieselregen'
        },
        'freezing rain': {
            es: 'lluvia helada',
            fr: 'pluie verglaçante',
            de: 'Eisregen'
        },
        'sleet': {
            es: 'aguanieve',
            fr: 'grésil',
            de: 'Graupel'
        },
        'dust': {
            es: 'polvo',
            fr: 'poussière',
            de: 'Staub'
        },
        'sand': {
            es: 'arena',
            fr: 'sable',
            de: 'Sand'
        },
        'smoke': {
            es: 'humo',
            fr: 'fumée',
            de: 'Rauch'
        },
        'volcanic ash': {
            es: 'ceniza volcánica',
            fr: 'cendre volcanique',
            de: 'Vulkanasche'
        },
        'squalls': {
            es: 'chubascos',
            fr: 'grains',
            de: 'Böen'
        },
        'tornado': {
            es: 'tornado',
            fr: 'tornade',
            de: 'Tornado'
        }
    };
    
    // Convert description to lowercase for case-insensitive matching
    const lowerDesc = description.toLowerCase();
    
    // Check if we have a translation for this description
    for (const [key, translations] of Object.entries(weatherDescriptions)) {
        if (lowerDesc.includes(key) && translations[language]) {
            // Replace the matching part with the translation
            return description.replace(new RegExp(key, 'i'), translations[language]);
        }
    }
    
    // If no translation found, return the original description
    return description;
}

// Extend the translateText function to include more translations
// This will merge with the existing translations in feelsLike.js
(function() {
    // Get the original translateText function
    const originalTranslateText = translateText;
    
    // Additional translations for feelsLikeDisplay.js
    const additionalTranslations = {
        pleaseEnterCity: {
            en: "Please enter a city",
            es: "Por favor, ingrese una ciudad",
            fr: "Veuillez entrer une ville",
            de: "Bitte geben Sie eine Stadt ein"
        },
        noWeatherAlerts: {
            en: "No weather alerts.",
            es: "No hay alertas meteorológicas.",
            fr: "Pas d'alertes météo.",
            de: "Keine Wetterwarnungen."
        },
        hourlyForecast: {
            en: "Hourly Forecast",
            es: "Pronóstico por Hora",
            fr: "Prévisions Horaires",
            de: "Stündliche Vorhersage"
        },
        errorFetchingData: {
            en: "Error fetching weather data. Please try again.",
            es: "Error al obtener datos meteorológicos. Por favor, inténtelo de nuevo.",
            fr: "Erreur lors de la récupération des données météo. Veuillez réessayer.",
            de: "Fehler beim Abrufen der Wetterdaten. Bitte versuchen Sie es erneut."
        },
        geolocationError: {
            en: "Geolocation error",
            es: "Error de geolocalización",
            fr: "Erreur de géolocalisation",
            de: "Geolokalisierungsfehler"
        },
        geolocationNotSupported: {
            en: "Geolocation is not supported by this browser.",
            es: "La geolocalización no es compatible con este navegador.",
            fr: "La géolocalisation n'est pas prise en charge par ce navigateur.",
            de: "Die Geolokalisierung wird von diesem Browser nicht unterstützt."
        },
        // AQI and UV translations
        airQualityIndex: {
            en: "Air Quality Index (AQI)",
            es: "Índice de Calidad del Aire (ICA)",
            fr: "Indice de Qualité de l'Air (IQA)",
            de: "Luftqualitätsindex (LQI)"
        },
        uvIndex: {
            en: "UV Index",
            es: "Índice UV",
            fr: "Indice UV",
            de: "UV-Index"
        },
        aqiGood: {
            en: "Good",
            es: "Bueno",
            fr: "Bon",
            de: "Gut"
        },
        aqiModerate: {
            en: "Moderate",
            es: "Moderado",
            fr: "Modéré",
            de: "Mäßig"
        },
        aqiUnhealthySensitive: {
            en: "Unhealthy for Sensitive Groups",
            es: "Insalubre para Grupos Sensibles",
            fr: "Malsain pour les Groupes Sensibles",
            de: "Ungesund für empfindliche Gruppen"
        },
        aqiUnhealthy: {
            en: "Unhealthy",
            es: "Insalubre",
            fr: "Malsain",
            de: "Ungesund"
        },
        aqiVeryUnhealthy: {
            en: "Very Unhealthy",
            es: "Muy Insalubre",
            fr: "Très Malsain",
            de: "Sehr Ungesund"
        },
        aqiHazardous: {
            en: "Hazardous",
            es: "Peligroso",
            fr: "Dangereux",
            de: "Gefährlich"
        },
        uvLow: {
            en: "Low",
            es: "Bajo",
            fr: "Faible",
            de: "Niedrig"
        },
        uvModerate: {
            en: "Moderate",
            es: "Moderado",
            fr: "Modéré",
            de: "Mäßig"
        },
        uvHigh: {
            en: "High",
            es: "Alto",
            fr: "Élevé",
            de: "Hoch"
        },
        uvVeryHigh: {
            en: "Very High",
            es: "Muy Alto",
            fr: "Très Élevé",
            de: "Sehr Hoch"
        },
        uvExtreme: {
            en: "Extreme",
            es: "Extremo",
            fr: "Extrême",
            de: "Extrem"
        },
        aqiAdvisory: {
            en: "Air quality is hazardous. Avoid outdoor activities.",
            es: "La calidad del aire es peligrosa. Evite actividades al aire libre.",
            fr: "La qualité de l'air est dangereuse. Évitez les activités en plein air.",
            de: "Die Luftqualität ist gefährlich. Vermeiden Sie Aktivitäten im Freien."
        },
        uvAdvisory: {
            en: "UV levels are dangerous. Wear sunscreen and limit sun exposure.",
            es: "Los niveles de UV son peligrosos. Use protector solar y limite la exposición al sol.",
            fr: "Les niveaux UV sont dangereux. Portez de la crème solaire et limitez l'exposition au soleil.",
            de: "Die UV-Werte sind gefährlich. Tragen Sie Sonnenschutz und begrenzen Sie die Sonnenexposition."
        },
        dataUnavailable: {
            en: "Data unavailable",
            es: "Datos no disponibles",
            fr: "Données non disponibles",
            de: "Daten nicht verfügbar"
        },
        // Date and time translations
        upcomingEvent: {
            en: "Upcoming",
            es: "Próximo",
            fr: "À venir",
            de: "Bevorstehend"
        },
        timeUntilNext: {
            en: "Time until next event",
            es: "Tiempo hasta el próximo evento",
            fr: "Temps jusqu'au prochain événement",
            de: "Zeit bis zum nächsten Ereignis"
        },
        sunriseNextDay: {
            en: "Sunrise (next day)",
            es: "Amanecer (día siguiente)",
            fr: "Lever du soleil (jour suivant)",
            de: "Sonnenaufgang (nächster Tag)"
        },
        // Location translations
        useMyLocation: {
            en: "Use My Location",
            es: "Usar Mi Ubicación",
            fr: "Utiliser Ma Position",
            de: "Meinen Standort verwenden"
        },
        enterCity: {
            en: "Enter city",
            es: "Ingrese ciudad",
            fr: "Entrez une ville",
            de: "Stadt eingeben"
        },
        dailyWeather: {
            en: "Daily Weather",
            es: "Clima Diario",
            fr: "Météo Quotidienne",
            de: "Tägliches Wetter"
        },
        noWeatherAlertsLocation: {
            en: "No weather alerts for",
            es: "No hay alertas meteorológicas para",
            fr: "Pas d'alertes météo pour",
            de: "Keine Wetterwarnungen für"
        }
    };
    
    // Override the translateText function to include our additional translations
    window.translateText = function(key) {
        // First check if it's one of our additional translations
        const language = localStorage.getItem(LANGUAGE_KEY) || 'en';
        
        if (additionalTranslations[key] && additionalTranslations[key][language]) {
            return additionalTranslations[key][language];
        }
        
        // If not found in additional translations, use the original function
        return originalTranslateText(key);
    };
})();
