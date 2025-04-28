//Function to check if notifications are supported and request permission
function requestNotificationPermission() {
    if ("Notification" in window) {
        if (Notification.permission === "default") {
            //Prompt the user if permission is not granted
            Notification.requestPermission().then(permission => {
                console.log("Notification permission:", permission);
            });
        } else {
            console.log("Notification permission already granted:", Notification.permission);
        }

    }
}

//Fetches Severe Weather Data from Weather API based on user input
async function getWeatherAlerts(lat, lon) {
    console.log("Getting weather alerts for:", lat, lon);

    if(!lat || !lon) {
        console.error("Latitude and Longitude are required for getting alerts.");
        return;
    }

    const alertURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum,sunrise,sunset&timezone=auto&forecast_days=7&alerts=true`;

    try {
        const response = await fetch(alertURL);
        if(!response.ok) throw new Error("Failed to get alerts");
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
        const noAlertsMessage = translateText('noAlerts');
        displayAlertMessage(noAlertsMessage);
        showNotification(noAlertsMessage);
        return;
    }

    const lastAlert = localStorage.getItem("lastWeatherAlert");
    console.log("Last alert from localStorage:", lastAlert);
    
    data.alerts.forEach(alert => {
        const alertMessage = alert.event; //Example: "Severe Thunderstorm Warning"
        const alertDescription = alert.description || "No description available";
        const alertStart = alert.start ? new Date(alert.start * 1000).toLocaleString() : "Unknown start time";
        const alertEnd = alert.end ? new Date(alert.end * 1000).toLocaleString() : "Unknown end time";

        // Determine severity based on alert message
        const isSevere = /warning|storm|hurricane|tornado|severe/i.test(alertMessage);
        
        // Get translated alert type
        const alertType = typeof translateText === 'function' 
            ? (isSevere ? translateText('severeWeatherAlert') : translateText('weatherAlert'))
            : (isSevere ? "Severe Weather Alert" : "Weather Alert");
            
        // Get translated labels
        const startLabel = typeof translateText === 'function' ? translateText('start') : "Start";
        const endLabel = typeof translateText === 'function' ? translateText('end') : "End";
        const descLabel = typeof translateText === 'function' ? translateText('description') : "Description";
        
        const formattedAlert = `${alertType}: ${alertMessage} ${startLabel}: ${alertStart} ${endLabel}: ${alertEnd} ${descLabel}: ${alertDescription}`;
        console.log("Formatted alert:", formattedAlert);

        //Check if this is a duplicate alert
        if (formattedAlert !== lastAlert) { 
            localStorage.setItem("lastWeatherAlert", formattedAlert);
        }

        //Show the formatted alert in both the UI and as a browser notification
        console.log("Displaying alert:", formattedAlert);
        showNotification(formattedAlert);
        displayAlertMessage(formattedAlert);
    });
}


//Creates a UI for Enabling and Disabling Alerts
//Saves the users preferences for alerts
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("alert-toggle");
    toggle.checked = JSON.parse(localStorage.getItem("weatherAlerts") || "false");
    toggle.addEventListener("change", ()=> {
        localStorage.setItem("weatherAlerts", toggle.checked);  
    });

    //Retrieve saved latitude and logitude from localStorage
    let savedLat = localStorage.getItem('latitude');
    let savedLon = localStorage.getItem('longitude');

    if (!savedLat || !savedLon) {
        //If there is no saved location, try to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                savedLat = position.coords.latitude;
                savedLon = position.coords.longitude;

                localStorage.setItem('latitude', savedLat);
                localStorage.setItem('longitude', savedLon);

                //Fetch alerts if the toggle is enabled
                if (toggle.checked) {
                    getWeatherAlerts(savedLat, savedLon);
                    startPeriodicAlertCheck(savedLat, savedLon);
                }
            }, error => {
                console.error("Error getting location:", error);
                document.getElementById('alertMessages').innerHTML = typeof translateText === 'function' 
                ? translateText('errorGettingLocation') 
                : "Error getting location. Please enter a latitude and longitude.";
            });
        } else {
            document.getElementById('alertMessages').innerHTML = typeof translateText === 'function' 
                ? translateText('geolocationNotSupported') 
                : "Geolocation is not supported. Please enter a latitude and longitude.";
        }
    } else {
        //Fetch alerts using saved location
        if (toggle.checked) {
            getWeatherAlerts(savedLat, savedLon);
            startPeriodicAlertCheck(savedLat, savedLon);
        } else {
            document.getElementById('alertMessages').innerHTML = typeof translateText === 'function' 
                ? translateText('alertsDisabled') 
                : "Weather alerts are disabled. Enable alerts to receive notifications.";
        }
    }
});

//Testing & Debugging
//Shows a browser notification if allowed
function showNotification(message) {
    // Get translated notification title
    const notificationTitle = typeof translateText === 'function' 
        ? translateText('weatherAlert') 
        : "Weather Alert";
        
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

//Will display alert message inside the webpage
function displayAlertMessage(message) {
    console.log("Displaying alert message:", message);
    const alertBox = document.getElementById("alertMessages");
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("notification");
    alertDiv.textContent = message;
    alertBox.appendChild(alertDiv);
}

//Request notification permission when page loads
requestNotificationPermission();
