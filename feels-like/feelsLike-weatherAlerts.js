const API_KEY = '66e860199c0f6438c737b4997bf7ba6d';

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

// Function to translate text based on user preference
function translateAlertText(key) {
    // Simple translations for weather alerts
    const translations = {
        weatherAlert: {
            en: "Weather Alert",
            es: "Alerta Meteorológica",
            fr: "Alerte Météo",
            de: "Wetterwarnung"
        },
        severeWeatherAlert: {
            en: "Severe Weather Alert",
            es: "Alerta Meteorológica Severa",
            fr: "Alerte Météo Sévère",
            de: "Schwere Wetterwarnung"
        },
        start: {
            en: "Start",
            es: "Inicio",
            fr: "Début",
            de: "Beginn"
        },
        end: {
            en: "End",
            es: "Fin",
            fr: "Fin",
            de: "Ende"
        },
        description: {
            en: "Description",
            es: "Descripción",
            fr: "Description",
            de: "Beschreibung"
        },
        noDescription: {
            en: "No description available",
            es: "No hay descripción disponible",
            fr: "Aucune description disponible",
            de: "Keine Beschreibung verfügbar"
        },
        noWeatherAlerts: {
            en: "There are currently no weather alerts.",
            es: "Actualmente no hay alertas meteorológicas.",
            fr: "Il n'y a actuellement aucune alerte météo.",
            de: "Es gibt derzeit keine Wetterwarnungen."
        },
        errorGettingLocation: {
            en: "Error getting location. Please enter a latitude and longitude.",
            es: "Error al obtener la ubicación. Por favor, introduzca una latitud y longitud.",
            fr: "Erreur lors de l'obtention de l'emplacement. Veuillez entrer une latitude et une longitude.",
            de: "Fehler beim Abrufen des Standorts. Bitte geben Sie einen Breitengrad und einen Längengrad ein."
        },
        geolocationNotSupported: {
            en: "Geolocation is not supported. Please enter a latitude and longitude.",
            es: "La geolocalización no es compatible. Por favor, introduzca una latitud y longitud.",
            fr: "La géolocalisation n'est pas prise en charge. Veuillez entrer une latitude et une longitude.",
            de: "Geolokalisierung wird nicht unterstützt. Bitte geben Sie einen Breitengrad und einen Längengrad ein."
        },
        alertsDisabled: {
            en: "Weather alerts are disabled. Enable alerts to receive notifications.",
            es: "Las alertas meteorológicas están desactivadas. Activa las alertas para recibir notificaciones.",
            fr: "Les alertes météo sont désactivées. Activez les alertes pour recevoir des notifications.",
            de: "Wetterwarnungen sind deaktiviert. Aktivieren Sie Warnungen, um Benachrichtigungen zu erhalten."
        }
    };
    
    const language = localStorage.getItem(LANGUAGE_KEY) || 'en';
    
    if (translations[key] && translations[key][language]) {
        return translations[key][language];
    }
    
    // Fallback to English if translation not found
    return translations[key]?.en || key;
}

// Function to check if notifications are supported and request permission
function requestNotificationPermission() {
    if ("Notification" in window) {
        if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                console.log("Notification permission:", permission);
            });
        } else {
            console.log("Notification permission already granted:", Notification.permission);
        }
    }
}

// Fetches Severe Weather Alerts from OpenWeatherMap One Call API 3.0
async function getWeatherAlerts(lat, lon) {
    console.log("Getting weather alerts for:", lat, lon);

    if (!lat || !lon) {
        console.error("Latitude and Longitude are required for getting alerts.");
        return;
    }

    // Use the units parameter based on temperature preference
    const units = getUnitsParameter();
    const alertURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;

    try {
        const response = await fetch(alertURL);
        if (!response.ok) throw new Error("Failed to get alerts");
        const data = await response.json();
        handleWeatherAlerts(data);
    } catch (error) {
        console.error("Error getting alerts:", error);
    }
}

// Function to periodically fetch weather alerts
function startPeriodicAlertCheck(lat, lon, interval = 60000) {
    setInterval(() => {
        getWeatherAlerts(lat, lon);
    }, interval);
}

// Processes and displays weather alerts
function handleWeatherAlerts(data) {
    console.log("Handling weather alerts:", data);
    const alertBox = document.getElementById("alertMessages");
    alertBox.innerHTML = ""; // Clear previous messages

    if (!data || !data.alerts || data.alerts.length === 0) {
        const noAlertsMessage = translateAlertText('noWeatherAlerts');
        displayAlertMessage(noAlertsMessage);
        showNotification(noAlertsMessage);
        return;
    }

    const lastAlert = localStorage.getItem("lastWeatherAlert");
    console.log("Last alert from localStorage:", lastAlert);

    data.alerts.forEach(alert => {
        const alertMessage = alert.event || translateAlertText('weatherAlert');
        const alertDescription = alert.description || translateAlertText('noDescription');
        const alertStart = alert.start ? new Date(alert.start * 1000).toLocaleString() : "Unknown start time";
        const alertEnd = alert.end ? new Date(alert.end * 1000).toLocaleString() : "Unknown end time";

        const isSevere = /warning|storm|hurricane|tornado|severe/i.test(alertMessage);
        const alertType = isSevere ? translateAlertText('severeWeatherAlert') : translateAlertText('weatherAlert');
        const startLabel = translateAlertText('start');
        const endLabel = translateAlertText('end');
        const descLabel = translateAlertText('description');
        
        const formattedAlert = `${alertType}: ${alertMessage} ${startLabel}: ${alertStart} ${endLabel}: ${alertEnd} ${descLabel}: ${alertDescription}`;

        if (formattedAlert !== lastAlert) {
            localStorage.setItem("lastWeatherAlert", formattedAlert);
        }

        showNotification(formattedAlert);
        displayAlertMessage(formattedAlert);
    });
}

// UI Toggle Setup and Geolocation Fetch
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("alert-toggle");
    toggle.checked = JSON.parse(localStorage.getItem("weatherAlerts") || "false");
    toggle.addEventListener("change", () => {
        localStorage.setItem("weatherAlerts", toggle.checked);
    });

    let savedLat = localStorage.getItem('latitude');
    let savedLon = localStorage.getItem('longitude');

    if (!savedLat || !savedLon) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                savedLat = position.coords.latitude;
                savedLon = position.coords.longitude;

                localStorage.setItem('latitude', savedLat);
                localStorage.setItem('longitude', savedLon);

                if (toggle.checked) {
                    getWeatherAlerts(savedLat, savedLon);
                    startPeriodicAlertCheck(savedLat, savedLon);
                }
            }, error => {
                console.error("Error getting location:", error);
                document.getElementById('alertMessages').innerHTML = translateAlertText('errorGettingLocation');
            });
        } else {
            document.getElementById('alertMessages').innerHTML = translateAlertText('geolocationNotSupported');
        }
    } else {
        if (toggle.checked) {
            getWeatherAlerts(savedLat, savedLon);
            startPeriodicAlertCheck(savedLat, savedLon);
        } else {
            document.getElementById('alertMessages').innerHTML = translateAlertText('alertsDisabled');
        }
    }
});

// Browser Notification Logic
function showNotification(message) {
    const notificationTitle = translateAlertText('weatherAlert');
    
    if (Notification.permission === "granted") {
        new Notification(notificationTitle, { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(notificationTitle, { body: message });
            }
        });
    }
}

// Display Alert in Webpage
function displayAlertMessage(message) {
    console.log("Displaying alert message:", message);
    const alertBox = document.getElementById("alertMessages");
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("notification");
    alertDiv.textContent = message;
    alertBox.appendChild(alertDiv);
}

// Ask for permission on load
requestNotificationPermission();
