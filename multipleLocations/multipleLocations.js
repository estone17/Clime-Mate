// Function to load saved locations from local storage
function loadSavedLocations() {
    const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    return savedLocations;
}

// Function to save locations to local storage
function saveLocations(locations) {
    localStorage.setItem('savedLocations', JSON.stringify(locations));
}

// Function to add a new location
function addLocation(location) {
    const savedLocations = loadSavedLocations();
    if (!savedLocations.includes(location)) {
        savedLocations.push(location);
        saveLocations(savedLocations);
        console.log(`Location "${location}" added successfully.`); // Debug log
    } else {
        console.log(`Location "${location}" already exists.`); // Debug log
    }
}

// Function to remove a location
function removeLocation(location) {
    const savedLocations = loadSavedLocations();
    const updatedLocations = savedLocations.filter(loc => loc !== location);
    saveLocations(updatedLocations);
}

// Function to render saved locations in a dropdown
function renderSavedLocationsDropdown() {
    const dropdown = document.getElementById('saved-locations-dropdown');
    dropdown.innerHTML = ''; // Clear existing options

    const savedLocations = loadSavedLocations();

    if (savedLocations.length === 0) {
        // Add the "No Cities Saved" option if no cities are saved
        const noCitiesOption = document.createElement('option');
        noCitiesOption.value = ""; // Default value
        noCitiesOption.textContent = "No Cities Saved";
        noCitiesOption.disabled = true; // Make it unselectable
        noCitiesOption.selected = true; // Set it as the default selected option
        dropdown.appendChild(noCitiesOption);
    } else {
        // Add the default "Select a Saved City" option
        const defaultOption = document.createElement('option');
        defaultOption.value = ""; // Default value
        defaultOption.textContent = "Select a Saved City";
        defaultOption.disabled = true; // Make it unselectable
        defaultOption.selected = true; // Set it as the default selected option
        dropdown.appendChild(defaultOption);

        // Add saved locations
        savedLocations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            dropdown.appendChild(option);
        });
    }
}

// Add event listener for switching locations only if the dropdown exists
const dropdown = document.getElementById('saved-locations-dropdown');
if (dropdown) {
    dropdown.addEventListener('change', function () {
        const selectedLocation = this.value;
        if (selectedLocation) {
            document.getElementById('city').value = selectedLocation;
            getWeather();
        }
    });
}

// Ensure the resetPage function clears the dropdown and other elements
function resetPage() {
    // Clear the input field
    document.getElementById('city').value = '';

    // Hide the weather icon
    document.getElementById('weather-icon').style.display = 'none';

    // Clear all displayed weather data
    document.getElementById('temp-div').innerHTML = '';
    document.getElementById('weather-info').innerHTML = '';
    document.getElementById('feels-like').innerHTML = '';
    document.getElementById('hourly-forecast').innerHTML = '';
    document.getElementById('details-content').innerHTML = '';
    document.getElementById('toggle-details-btn').style.display = 'none'; // Hide "More Details" button

    // Clear and hide the date display
    const dateDiv = document.getElementById('date-div');
    dateDiv.innerHTML = ''; // Clear the date content
    dateDiv.style.display = 'none'; // Ensure the date is hidden

    // Reset the dropdown to its default state
    renderSavedLocationsDropdown(); // Re-render the dropdown to reset its state
}

async function displayWeather(data) {
    const dateDiv = document.getElementById('date-div'); // Reference the date div

    if (data.cod === '404') {
        // Handle error case
        dateDiv.style.display = 'none'; // Ensure the date is hidden if no valid data
        document.getElementById('weather-info').innerHTML = `<p>${data.message}</p>`; // Display error message
    } else {
        // Handle valid weather data
        const cityName = data.name;
        const country = data.sys.country;
        const location = `${cityName}, ${country}`; // Format location

        const currentDate = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        dateDiv.innerHTML = `<p>${currentDate}</p>`;
        dateDiv.style.display = 'block'; // Ensure the date is visible when valid data is displayed

        // ...existing code for displaying weather data...
    }
}

// Initialize saved locations dropdown on page load
document.addEventListener('DOMContentLoaded', renderSavedLocationsDropdown);

// Export functions for testing
module.exports = {
    loadSavedLocations,
    saveLocations,
    addLocation,
    removeLocation,
    renderSavedLocationsDropdown
};