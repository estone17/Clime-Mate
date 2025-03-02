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


//Testing for weather alerts before api key
/*async function getWeatherAlerts() {
    console.log("Getting weather alerts...");

    const fakeData = {
        alerts: [
            {event: "Severe Thunderstorm Warning"}
        ]
    };

    handleWeatherAlerts(fakeData);
}*/


//Fetches Severe Weather Data from Weather API based on user input
async function getWeatherAlerts(lat, lon) {
    console.log("Getting weather alerts for:", lat, lon);

    if(!lat || !lon) {
        console.error("Latitude and Longitude are required for getting alerts.");
        return;
    }

    const alertURL = `https://api.open-meteo.com/v1/warnings?latitude=${lat}&longitude=${lon}`;

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
    const alertBox = document.getElementById("alertMessages");
    alertBox.innerHTML = ""; // Clear previous messages

    if (!data || !data.alerts || data.alerts.length === 0) {
        displayAlertMessage("There are currently no weather alerts.");
        return;
    }
    
    data.alerts.forEach(alert => {
        const alertMessage = alert.event; //Example: "Severe Thunderstorm Warning"
        const alertDescription = alert.description || "No description available";
        const alertStart = new Date(alert.start * 1000).toLocaleString(); "Unknown start time";
        const alertEnd = new Date(alert.end * 1000).toLocaleString(); "Unknown end time";

        // Determine severity based on alert message
        const isSevere = /warning|storm|hurricane|tornado|severe/i.test(alertMessage);
        const formattedAlert = `${isSevere ? "Severe Weather Alert" : "Weather Alert"}: ${alertMessage} Start: ${alertStart} End: ${alertEnd} Description: ${alertDescription}`;

        //Show the formatted alert in both the UI and as a browser notification
        showNotification(formattedAlert);
        displayAlertMessage(formattedAlert);
    });
}


//Creates a UI for Enabling and Disabling Alerts
//Saves the users preferences for alerts
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("alert-toggle");
    toggle.checked = localStorage.getItem("weatherAlerts") == "true";
    toggle.addEventListener("change", ()=> {
        localStorage.setItem("weatherAlerts", toggle.checked);  
    });

    //Retrieve saved latitude and logitude from localStorage
    const savedLat = localStorage.getItem('latitude');
    const savedLon = localStorage.getItem('longitude');

    if (savedLat && savedLon) {
        //Fetch weather alerts based on saved location
        if(toggle.checked) {
            getWeatherAlerts(savedLat, savedLon);
            startPeriodicAlertCheck(savedLat, savedLon);
        } else {
            document.getElementById('alertMessages').innerHTML = "Weather alerts are turned off.";
        }
    } else {
        document.getElementById('alertMessages').innerHTML = "No location saved. Please visit the Home page to set your location.";
    }

    //Get weather alerts when user searches for a location
    document.getElementById("searchBtn").addEventListener("click", () => {
        const lat = document.getElementById("lat").value;
        const lon = document.getElementById("lon").value;

        if (toggle.checked)  {
            getWeatherAlerts(lat, lon);
            startPeriodicAlertCheck(lat, lon);
        }
    });
});


//Testing & Debugging
//Shows a browser notification if allowed
function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("Weather Alert", { body: message });
    }
}

//Will display alert message inside the webpage
function displayAlertMessage(message) {
    const alertBox = document.getElementById("alertMessages");
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("notification");
    alertDiv.textContent = message;
    alertBox.appendChild(alertDiv);
}

//Request notification permission when page loads
requestNotificationPermission();