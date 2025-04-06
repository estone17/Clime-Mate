const API_KEY = '66e860199c0f6438c737b4997bf7ba6d';

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

    const alertURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

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
        const noAlertsMessage = "There are currently no weather alerts.";
        displayAlertMessage(noAlertsMessage);
        showNotification(noAlertsMessage);
        return;
    }

    const lastAlert = localStorage.getItem("lastWeatherAlert");
    console.log("Last alert from localStorage:", lastAlert);

    data.alerts.forEach(alert => {
        const alertMessage = alert.event || "Weather Alert";
        const alertDescription = alert.description || "No description available";
        const alertStart = alert.start ? new Date(alert.start * 1000).toLocaleString() : "Unknown start time";
        const alertEnd = alert.end ? new Date(alert.end * 1000).toLocaleString() : "Unknown end time";

        const isSevere = /warning|storm|hurricane|tornado|severe/i.test(alertMessage);
        const formattedAlert = `${isSevere ? "Severe Weather Alert" : "Weather Alert"}: ${alertMessage} Start: ${alertStart} End: ${alertEnd} Description: ${alertDescription}`;

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
                document.getElementById('alertMessages').innerHTML = "Error getting location. Please enter a latitude and longitude.";
            });
        } else {
            document.getElementById('alertMessages').innerHTML = "Geolocation is not supported. Please enter a latitude and longitude.";
        }
    } else {
        if (toggle.checked) {
            getWeatherAlerts(savedLat, savedLon);
            startPeriodicAlertCheck(savedLat, savedLon);
        } else {
            document.getElementById('alertMessages').innerHTML = "Weather alerts are disabled. Enable alerts to receive notifications.";
        }
    }
});

// Browser Notification Logic
function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("Weather Alert", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Weather Alert", { body: message });
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
