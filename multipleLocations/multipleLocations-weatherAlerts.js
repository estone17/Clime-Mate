const API_KEY = '11db04fedfef47a38aefad4afbc440c1';

// Fetch severe weather alerts using Weatherbit.io API
function fetchWeatherAlerts(lat, lon) {
    const weatherAlertsUrl = `https://api.weatherbit.io/v2.0/alerts?lat=${lat}&lon=${lon}&key=${API_KEY}`;

    return fetch(weatherAlertsUrl)
        .then(response => response.json().then(data => {
            if (!response.ok) throw new Error(data.error || 'Failed to fetch weather alerts');
            return data.alerts || []; // Return alerts array or an empty array if no alerts
        }))
        .catch(error => {
            console.error('Error fetching weather alerts:', error);
            return [];
        });
}

// Display weather alerts
function displayWeatherAlerts(alerts, cityName = 'your location') {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = ''; // Clear previous alerts

    if (alerts.length === 0) {
        alertsContainer.innerHTML = `<p>No severe weather alerts for ${cityName}.</p>`;
        return;
    }

    alerts.forEach(alert => {
        const alertHtml = `
            <div class="alert">
                <h3>${alert.title}</h3>
                <p><strong>Severity:</strong> ${alert.severity}</p>
                <p><strong>Effective:</strong> ${alert.effective_local}</p>
                <p><strong>Expires:</strong> ${alert.expires_local}</p>
                <p><strong>Description:</strong> ${alert.description}</p>
            </div>
        `;
        alertsContainer.innerHTML += alertHtml;
    });
}

// Function to request notification permission
function requestNotificationPermission() {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
                console.warn('Notification permission not granted.');
            }
        });
    }
}

// Function to trigger desktop notifications
function triggerNotification(title, message) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
    } else {
        console.warn('Notification permission not granted.');
    }
}

// Function to check weather alerts periodically
function checkWeatherAlertsPeriodically(lat, lon) {
    setInterval(() => {
        fetchWeatherAlerts(lat, lon).then(alerts => {
            if (alerts.length > 0) {
                triggerNotification('Weather Alert', `There are ${alerts.length} active weather alerts in your area.`);
            } else {
                triggerNotification('Weather Alert', 'No active weather alerts in your area.');
            }
        }).catch(error => {
            console.error('Error checking weather alerts:', error);
        });
    }, 3 * 60 * 1000); // Every 3 minutes
}

// Example usage
function getWeatherAlertsByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Request notification permission
            requestNotificationPermission();

            fetchWeatherAlerts(lat, lon).then(alerts => {
                // Fetch city name using reverse geocoding
                fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${API_KEY}`)
                    .then(response => response.json())
                    .then(data => {
                        const cityName = data.data[0]?.city_name || 'your location';
                        displayWeatherAlerts(alerts, cityName);
                    })
                    .catch(error => {
                        console.error('Error fetching city name:', error);
                        displayWeatherAlerts(alerts);
                    });

                // Start periodic alert checks
                checkWeatherAlertsPeriodically(lat, lon);
            });
        }, error => {
            console.error('Geolocation error:', error.message);
            alert('Unable to fetch geolocation. Please try again.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
