// Constants for localStorage keys
const TEMP_UNIT_KEY = 'clime-mate-temp-unit';
const LANGUAGE_KEY = 'clime-mate-language';

// Language translations
const translations = {
    en: {
        // Navigation translations
        home: "Home",
        settings: "Settings",
        
        // Weather card translations
        high: "High",
        low: "Low",
        rainSum: "Rain Sum",
        snowSum: "Snow Sum",
        sunrise: "Sunrise",
        sunset: "Sunset",
        weatherAlerts: "Weather Alerts",
        enableAlerts: "Enable Weather Alerts",
        searchLatitude: "Latitude",
        searchLongitude: "Longitude",
        search: "Search",
        locationAlert: "Please fill in the location below to get weather data",
        
        // Weather alerts translations
        alertsDisabled: "Weather alerts are disabled. Enable alerts to receive notifications.",
        noAlerts: "There are currently no weather alerts.",
        weatherAlert: "Weather Alert",
        severeWeatherAlert: "Severe Weather Alert",
        start: "Start",
        end: "End",
        description: "Description",
        geolocationNotSupported: "Geolocation is not supported. Please enter a latitude and longitude.",
        errorGettingLocation: "Error getting location. Please enter a latitude and longitude.",
        
        // Settings page translations
        settingsTitle: "Clime-Mate Settings",
        selectTheme: "Select Theme",
        lightTheme: "Light Theme",
        darkTheme: "Dark Theme",
        customTheme: "Custom Theme",
        customizeTheme: "Customize Your Theme",
        bgColor: "Background Color",
        textColor: "Text Color",
        selectView: "Select View",
        compactView: "Compact View",
        detailedView: "Detailed View",
        tempUnit: "Temperature Unit",
        language: "Language",
        saveSettings: "Save Settings",
        settingsSaved: "Settings saved successfully!",
        
        // AQI and UV translations
        airQualityIndex: "Air Quality Index (AQI)",
        uvIndex: "UV Index",
        aqiGood: "Good",
        aqiModerate: "Moderate",
        aqiUnhealthySensitive: "Unhealthy for Sensitive Groups",
        aqiUnhealthy: "Unhealthy",
        aqiVeryUnhealthy: "Very Unhealthy",
        aqiHazardous: "Hazardous",
        uvLow: "Low",
        uvModerate: "Moderate",
        uvHigh: "High",
        uvVeryHigh: "Very High",
        uvExtreme: "Extreme",
        enableAQIUV: "Enable AQI and UV",
        aqiAdvisory: "Air quality is hazardous. Avoid outdoor activities.",
        uvAdvisory: "UV levels are dangerous. Wear sunscreen and limit sun exposure.",
        dataUnavailable: "Data unavailable",
        
        // Feels Like translations
        feelsLike: "Feels Like",
        enableFeelsLike: "Enable Feels Like",
        
        // Weekly forecast translations
        weeklyForecast: "Weekly Forecast",
        
        // Date and time translations
        upcomingEvent: "Upcoming",
        timeUntilNext: "Time until next event",
        sunriseNextDay: "Sunrise (next day)",
        
        // Location translations
        useMyLocation: "Use My Location",
        enterCity: "Enter city",
        dailyWeather: "Daily Weather",
        noWeatherAlertsLocation: "No weather alerts for",
        
        // UI elements
        moreDetails: "More Details",
        hideDetails: "Hide Details",
        
        // Error messages
        errorFetchingWeather: "Error fetching weather data. Please try again.",
        errorFetchingHourly: "Error fetching hourly forecast data. Please try again."
    },
    es: {
        // Navigation translations
        home: "Inicio",
        settings: "Configuración",
        
        // Weather card translations
        high: "Máxima",
        low: "Mínima",
        rainSum: "Lluvia",
        snowSum: "Nieve",
        sunrise: "Amanecer",
        sunset: "Atardecer",
        weatherAlerts: "Alertas Meteorológicas",
        enableAlerts: "Activar Alertas Meteorológicas",
        searchLatitude: "Latitud",
        searchLongitude: "Longitud",
        search: "Buscar",
        locationAlert: "Por favor, complete la ubicación para obtener datos meteorológicos",
        
        // Weather alerts translations
        alertsDisabled: "Las alertas meteorológicas están desactivadas. Activa las alertas para recibir notificaciones.",
        noAlerts: "Actualmente no hay alertas meteorológicas.",
        weatherAlert: "Alerta Meteorológica",
        severeWeatherAlert: "Alerta Meteorológica Severa",
        start: "Inicio",
        end: "Fin",
        description: "Descripción",
        geolocationNotSupported: "La geolocalización no es compatible. Por favor, introduzca una latitud y longitud.",
        errorGettingLocation: "Error al obtener la ubicación. Por favor, introduzca una latitud y longitud.",
        
        // Settings page translations
        settingsTitle: "Configuración de Clime-Mate",
        selectTheme: "Seleccionar Tema",
        lightTheme: "Tema Claro",
        darkTheme: "Tema Oscuro",
        customTheme: "Tema Personalizado",
        customizeTheme: "Personaliza tu Tema",
        bgColor: "Color de Fondo",
        textColor: "Color de Texto",
        selectView: "Seleccionar Vista",
        compactView: "Vista Compacta",
        detailedView: "Vista Detallada",
        tempUnit: "Unidad de Temperatura",
        language: "Idioma",
        saveSettings: "Guardar Configuración",
        settingsSaved: "¡Configuración guardada con éxito!",
        
        // AQI and UV translations
        airQualityIndex: "Índice de Calidad del Aire (ICA)",
        uvIndex: "Índice UV",
        aqiGood: "Bueno",
        aqiModerate: "Moderado",
        aqiUnhealthySensitive: "Insalubre para Grupos Sensibles",
        aqiUnhealthy: "Insalubre",
        aqiVeryUnhealthy: "Muy Insalubre",
        aqiHazardous: "Peligroso",
        uvLow: "Bajo",
        uvModerate: "Moderado",
        uvHigh: "Alto",
        uvVeryHigh: "Muy Alto",
        uvExtreme: "Extremo",
        enableAQIUV: "Activar ICA y UV",
        aqiAdvisory: "La calidad del aire es peligrosa. Evite actividades al aire libre.",
        uvAdvisory: "Los niveles de UV son peligrosos. Use protector solar y limite la exposición al sol.",
        dataUnavailable: "Datos no disponibles",
        
        // Feels Like translations
        feelsLike: "Sensación Térmica",
        enableFeelsLike: "Activar Sensación Térmica",
        
        // Weekly forecast translations
        weeklyForecast: "Pronóstico Semanal",
        
        // Date and time translations
        upcomingEvent: "Próximo",
        timeUntilNext: "Tiempo hasta el próximo evento",
        sunriseNextDay: "Amanecer (día siguiente)",
        
        // Location translations
        useMyLocation: "Usar Mi Ubicación",
        enterCity: "Ingrese ciudad",
        dailyWeather: "Clima Diario",
        noWeatherAlertsLocation: "No hay alertas meteorológicas para",
        
        // UI elements
        moreDetails: "Más Detalles",
        hideDetails: "Ocultar Detalles",
        
        // Error messages
        errorFetchingWeather: "Error al obtener datos meteorológicos. Por favor, inténtelo de nuevo.",
        errorFetchingHourly: "Error al obtener el pronóstico por hora. Por favor, inténtelo de nuevo."
    },
    fr: {
        // Navigation translations
        home: "Accueil",
        settings: "Paramètres",
        
        // Weather card translations
        high: "Maximale",
        low: "Minimale",
        rainSum: "Pluie",
        snowSum: "Neige",
        sunrise: "Lever du soleil",
        sunset: "Coucher du soleil",
        weatherAlerts: "Alertes Météo",
        enableAlerts: "Activer les Alertes Météo",
        searchLatitude: "Latitude",
        searchLongitude: "Longitude",
        search: "Rechercher",
        locationAlert: "Veuillez remplir l'emplacement ci-dessous pour obtenir les données météo",
        
        // Weather alerts translations
        alertsDisabled: "Les alertes météo sont désactivées. Activez les alertes pour recevoir des notifications.",
        noAlerts: "Il n'y a actuellement aucune alerte météo.",
        weatherAlert: "Alerte Météo",
        severeWeatherAlert: "Alerte Météo Sévère",
        start: "Début",
        end: "Fin",
        description: "Description",
        geolocationNotSupported: "La géolocalisation n'est pas prise en charge. Veuillez entrer une latitude et une longitude.",
        errorGettingLocation: "Erreur lors de l'obtention de l'emplacement. Veuillez entrer une latitude et une longitude.",
        
        // Settings page translations
        settingsTitle: "Paramètres de Clime-Mate",
        selectTheme: "Sélectionner un Thème",
        lightTheme: "Thème Clair",
        darkTheme: "Thème Sombre",
        customTheme: "Thème Personnalisé",
        customizeTheme: "Personnaliser Votre Thème",
        bgColor: "Couleur d'Arrière-plan",
        textColor: "Couleur du Texte",
        selectView: "Sélectionner la Vue",
        compactView: "Vue Compacte",
        detailedView: "Vue Détaillée",
        tempUnit: "Unité de Température",
        language: "Langue",
        saveSettings: "Enregistrer les Paramètres",
        settingsSaved: "Paramètres enregistrés avec succès!",
        
        // AQI and UV translations
        airQualityIndex: "Indice de Qualité de l'Air (IQA)",
        uvIndex: "Indice UV",
        aqiGood: "Bon",
        aqiModerate: "Modéré",
        aqiUnhealthySensitive: "Malsain pour les Groupes Sensibles",
        aqiUnhealthy: "Malsain",
        aqiVeryUnhealthy: "Très Malsain",
        aqiHazardous: "Dangereux",
        uvLow: "Faible",
        uvModerate: "Modéré",
        uvHigh: "Élevé",
        uvVeryHigh: "Très Élevé",
        uvExtreme: "Extrême",
        enableAQIUV: "Activer IQA et UV",
        aqiAdvisory: "La qualité de l'air est dangereuse. Évitez les activités en plein air.",
        uvAdvisory: "Les niveaux UV sont dangereux. Portez de la crème solaire et limitez l'exposition au soleil.",
        dataUnavailable: "Données non disponibles",
        
        // Feels Like translations
        feelsLike: "Ressenti",
        enableFeelsLike: "Activer Température Ressentie",
        
        // Weekly forecast translations
        weeklyForecast: "Prévisions Hebdomadaires",
        
        // Date and time translations
        upcomingEvent: "À venir",
        timeUntilNext: "Temps jusqu'au prochain événement",
        sunriseNextDay: "Lever du soleil (jour suivant)",
        
        // Location translations
        useMyLocation: "Utiliser Ma Position",
        enterCity: "Entrez une ville",
        dailyWeather: "Météo Quotidienne",
        noWeatherAlertsLocation: "Pas d'alertes météo pour",
        
        // UI elements
        moreDetails: "Plus de Détails",
        hideDetails: "Masquer les Détails",
        
        // Error messages
        errorFetchingWeather: "Erreur lors de la récupération des données météo. Veuillez réessayer.",
        errorFetchingHourly: "Erreur lors de la récupération des prévisions horaires. Veuillez réessayer."
    },
    de: {
        // Navigation translations
        home: "Startseite",
        settings: "Einstellungen",
        
        // Weather card translations
        high: "Höchst",
        low: "Tiefst",
        rainSum: "Regen",
        snowSum: "Schnee",
        sunrise: "Sonnenaufgang",
        sunset: "Sonnenuntergang",
        weatherAlerts: "Wetterwarnungen",
        enableAlerts: "Wetterwarnungen aktivieren",
        searchLatitude: "Breitengrad",
        searchLongitude: "Längengrad",
        search: "Suchen",
        locationAlert: "Bitte geben Sie den Standort ein, um Wetterdaten zu erhalten",
        
        // Weather alerts translations
        alertsDisabled: "Wetterwarnungen sind deaktiviert. Aktivieren Sie Warnungen, um Benachrichtigungen zu erhalten.",
        noAlerts: "Es gibt derzeit keine Wetterwarnungen.",
        weatherAlert: "Wetterwarnung",
        severeWeatherAlert: "Schwere Wetterwarnung",
        start: "Beginn",
        end: "Ende",
        description: "Beschreibung",
        geolocationNotSupported: "Geolokalisierung wird nicht unterstützt. Bitte geben Sie einen Breitengrad und einen Längengrad ein.",
        errorGettingLocation: "Fehler beim Abrufen des Standorts. Bitte geben Sie einen Breitengrad und einen Längengrad ein.",
        
        // Settings page translations
        settingsTitle: "Clime-Mate Einstellungen",
        selectTheme: "Thema Auswählen",
        lightTheme: "Helles Thema",
        darkTheme: "Dunkles Thema",
        customTheme: "Benutzerdefiniertes Thema",
        customizeTheme: "Passen Sie Ihr Thema an",
        bgColor: "Hintergrundfarbe",
        textColor: "Textfarbe",
        selectView: "Ansicht Auswählen",
        compactView: "Kompakte Ansicht",
        detailedView: "Detaillierte Ansicht",
        tempUnit: "Temperatureinheit",
        language: "Sprache",
        saveSettings: "Einstellungen Speichern",
        settingsSaved: "Einstellungen erfolgreich gespeichert!",
        
        // AQI and UV translations
        airQualityIndex: "Luftqualitätsindex (LQI)",
        uvIndex: "UV-Index",
        aqiGood: "Gut",
        aqiModerate: "Mäßig",
        aqiUnhealthySensitive: "Ungesund für empfindliche Gruppen",
        aqiUnhealthy: "Ungesund",
        aqiVeryUnhealthy: "Sehr Ungesund",
        aqiHazardous: "Gefährlich",
        uvLow: "Niedrig",
        uvModerate: "Mäßig",
        uvHigh: "Hoch",
        uvVeryHigh: "Sehr Hoch",
        uvExtreme: "Extrem",
        enableAQIUV: "LQI und UV aktivieren",
        aqiAdvisory: "Die Luftqualität ist gefährlich. Vermeiden Sie Aktivitäten im Freien.",
        uvAdvisory: "Die UV-Werte sind gefährlich. Tragen Sie Sonnenschutz und begrenzen Sie die Sonnenexposition.",
        dataUnavailable: "Daten nicht verfügbar",
        
        // Feels Like translations
        feelsLike: "Gefühlt",
        enableFeelsLike: "Gefühlte Temperatur aktivieren",
        
        // Weekly forecast translations
        weeklyForecast: "Wochenvorhersage",
        
        // Date and time translations
        upcomingEvent: "Bevorstehend",
        timeUntilNext: "Zeit bis zum nächsten Ereignis",
        sunriseNextDay: "Sonnenaufgang (nächster Tag)",
        
        // Location translations
        useMyLocation: "Meinen Standort verwenden",
        enterCity: "Stadt eingeben",
        dailyWeather: "Tägliches Wetter",
        noWeatherAlertsLocation: "Keine Wetterwarnungen für",
        
        // UI elements
        moreDetails: "Mehr Details",
        hideDetails: "Details ausblenden",
        
        // Error messages
        errorFetchingWeather: "Fehler beim Abrufen der Wetterdaten. Bitte versuchen Sie es erneut.",
        errorFetchingHourly: "Fehler beim Abrufen der stündlichen Vorhersage. Bitte versuchen Sie es erneut."
    }
};

// Initialize settings as soon as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
} else {
    // Document already loaded, run immediately
    initSettings();
}

// Function to initialize temperature unit and language settings
function initSettings() {
    console.log('Initializing settings...');
    
    // 1. Load the saved temperature unit (default to 'fahrenheit' if none found)
    const savedTempUnit = localStorage.getItem(TEMP_UNIT_KEY) || 'fahrenheit';
    
    // 2. Update the temperature unit selector if it exists
    const tempUnitSelector = document.getElementById('temp-unit-selector');
    if (tempUnitSelector) {
        tempUnitSelector.value = savedTempUnit;
    }
    
    // 3. Load the saved language (default to 'en' if none found)
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) || 'en';
    
    // 4. Update the language selector if it exists
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = savedLanguage;
    }
    
    // 5. Apply translations if we're on the settings page
    if (window.location.href.includes('settings.html')) {
        applyTranslations(savedLanguage);
    }
    
    console.log('Settings initialization complete:', { tempUnit: savedTempUnit, language: savedLanguage });
}

// Function to save all settings
function saveSettings() {
    console.log('Saving settings...');
    
    // Get selected values
    const tempUnitSelector = document.getElementById('temp-unit-selector');
    const languageSelector = document.getElementById('language-selector');
    
    if (tempUnitSelector && languageSelector) {
        const tempUnit = tempUnitSelector.value;
        const language = languageSelector.value;
        
        // Save settings to localStorage
        localStorage.setItem(TEMP_UNIT_KEY, tempUnit);
        localStorage.setItem(LANGUAGE_KEY, language);
        
        console.log('Settings saved:', { tempUnit, language });
        
        // Apply translations if language changed
        applyTranslations(language);
        
        // Show confirmation message
        const saveConfirmation = document.getElementById('save-confirmation');
        if (saveConfirmation) {
            saveConfirmation.style.display = 'inline';
            
            // Hide confirmation message after 3 seconds
            setTimeout(() => {
                saveConfirmation.style.display = 'none';
            }, 3000);
        }
    }
}

// Function to apply translations to the settings page
function applyTranslations(language) {
    const trans = translations[language];
    if (!trans) return;
    
    // Update page title
    document.title = `${trans.settingsTitle} - Clime-Mate`;
    
    // Update settings heading
    const settingsHeading = document.querySelector('.container h2');
    if (settingsHeading) {
        settingsHeading.textContent = trans.settingsTitle;
    }
    
    // Update navigation links
    const homeLink = document.querySelector('a.nav-link[href="test.html"]');
    if (homeLink) {
        homeLink.textContent = trans.home;
    }
    
    const settingsLink = document.querySelector('a.nav-link[href="settings.html"]');
    if (settingsLink) {
        settingsLink.textContent = trans.settings;
    }
    
    // Update theme selector label
    const themeLabel = document.querySelector('label[for="theme-selector"]');
    if (themeLabel) {
        themeLabel.textContent = `${trans.selectTheme}:`;
    }
    
    // Update theme options
    const themeOptions = document.querySelectorAll('#theme-selector option');
    if (themeOptions.length >= 3) {
        themeOptions[0].textContent = trans.lightTheme;
        themeOptions[1].textContent = trans.darkTheme;
        themeOptions[2].textContent = trans.customTheme;
    }
    
    // Update custom theme heading
    const customThemeHeading = document.querySelector('.custom-theme-settings h3');
    if (customThemeHeading) {
        customThemeHeading.textContent = trans.customizeTheme;
    }
    
    // Update background color label
    const bgColorLabel = document.querySelector('label[for="bg-color"]');
    if (bgColorLabel) {
        bgColorLabel.textContent = `${trans.bgColor}:`;
    }
    
    // Update text color label
    const textColorLabel = document.querySelector('label[for="text-color"]');
    if (textColorLabel) {
        textColorLabel.textContent = `${trans.textColor}:`;
    }
    
    // Update view selector label
    const viewLabel = document.querySelector('label[for="view-selector"]');
    if (viewLabel) {
        viewLabel.textContent = `${trans.selectView}:`;
    }
    
    // Update view options
    const viewOptions = document.querySelectorAll('#view-selector option');
    if (viewOptions.length >= 2) {
        viewOptions[0].textContent = trans.compactView;
        viewOptions[1].textContent = trans.detailedView;
    }
    
    // Update temperature unit selector label
    const tempUnitLabel = document.querySelector('label[for="temp-unit-selector"]');
    if (tempUnitLabel) {
        tempUnitLabel.textContent = `${trans.tempUnit}:`;
    }
    
    // Update language selector label
    const languageLabel = document.querySelector('label[for="language-selector"]');
    if (languageLabel) {
        languageLabel.textContent = `${trans.language}:`;
    }
    
    // Update save button and confirmation message
    const saveButton = document.getElementById('save-settings');
    if (saveButton) {
        saveButton.textContent = trans.saveSettings;
    }
    
    const saveConfirmation = document.getElementById('save-confirmation');
    if (saveConfirmation) {
        saveConfirmation.textContent = trans.settingsSaved;
    }
}

// Utility function to convert temperature based on user preference
function convertTemperature(tempCelsius) {
    const unit = localStorage.getItem(TEMP_UNIT_KEY) || 'fahrenheit';
    
    if (unit === 'celsius') {
        return tempCelsius;
    } else {
        // Convert to Fahrenheit: (C * 9/5) + 32
        return (tempCelsius * 9/5) + 32;
    }
}

// Utility function to format temperature with the appropriate unit symbol
function formatTemperature(temp) {
    const unit = localStorage.getItem(TEMP_UNIT_KEY) || 'fahrenheit';
    const roundedTemp = Math.round(temp);
    
    if (unit === 'celsius') {
        return `${roundedTemp}°C`;
    } else {
        return `${roundedTemp}°F`;
    }
}

// Utility function to translate text based on user preference
function translateText(key) {
    const language = localStorage.getItem(LANGUAGE_KEY) || 'en';
    const trans = translations[language];
    
    if (trans && trans[key]) {
        return trans[key];
    }
    
    // Fallback to English if translation not found
    return translations.en[key] || key;
}

//exports
module.exports = {translateText, formatTemperature, convertTemperature, applyTranslations, saveSettings, initSettings};
