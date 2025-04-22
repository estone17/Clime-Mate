const { loadSavedLocations, saveLocations, addLocation, removeLocation, renderSavedLocationsDropdown } = require('../multipleLocations/multipleLocations');

jest.mock('../multipleLocations/multipleLocations', () => {
    const originalModule = jest.requireActual('../multipleLocations/multipleLocations');
    return {
        ...originalModule,
        getWeather: jest.fn(), // Mock getWeather function
    };
});

describe('multipleLocations.js', () => {
    beforeEach(() => {
        localStorage.clear(); // Clear localStorage before each test
        document.body.innerHTML = `
            <input id="city" />
            <select id="saved-locations-dropdown"></select>
            <div id="weather-icon"></div>
            <div id="temp-div"></div>
            <div id="weather-info"></div>
            <div id="feels-like"></div>
            <div id="hourly-forecast"></div>
            <div id="details-content"></div>
            <button id="toggle-details-btn"></button>
            <div id="date-div"></div>
        `; // Set up DOM for testing
    });

    test('loadSavedLocations should return an empty array if no locations are saved', () => {
        const locations = loadSavedLocations();
        expect(locations).toEqual([]);
    });

    test('saveLocations should save locations to localStorage', () => {
        const locations = ['New York, US', 'Los Angeles, US'];
        saveLocations(locations);
        const savedLocations = JSON.parse(localStorage.getItem('savedLocations'));
        expect(savedLocations).toEqual(locations);
    });

    test('addLocation should add a new location if it does not already exist', () => {
        const location = 'Chicago, US';
        addLocation(location);
        const savedLocations = loadSavedLocations();
        expect(savedLocations).toContain(location);
    });

    test('addLocation should not add a duplicate location', () => {
        const location = 'Chicago, US';
        addLocation(location);
        addLocation(location);
        const savedLocations = loadSavedLocations();
        expect(savedLocations).toEqual([location]);
    });

    test('removeLocation should remove an existing location', () => {
        const locations = ['New York, US', 'Los Angeles, US'];
        saveLocations(locations);
        removeLocation('New York, US');
        const savedLocations = loadSavedLocations();
        expect(savedLocations).toEqual(['Los Angeles, US']);
    });

    test('removeLocation should do nothing if the location does not exist', () => {
        const locations = ['New York, US'];
        saveLocations(locations);
        removeLocation('Los Angeles, US');
        const savedLocations = loadSavedLocations();
        expect(savedLocations).toEqual(['New York, US']);
    });

    test('renderSavedLocationsDropdown should render "No Cities Saved" if no locations exist', () => {
        document.body.innerHTML = '<select id="saved-locations-dropdown"></select>';
        renderSavedLocationsDropdown();
        const dropdown = document.getElementById('saved-locations-dropdown');
        expect(dropdown.options.length).toBe(1);
        expect(dropdown.options[0].textContent).toBe('No Cities Saved');
    });

    test('renderSavedLocationsDropdown should render saved locations', () => {
        const locations = ['New York, US', 'Los Angeles, US'];
        saveLocations(locations);
        document.body.innerHTML = '<select id="saved-locations-dropdown"></select>';
        renderSavedLocationsDropdown();
        const dropdown = document.getElementById('saved-locations-dropdown');
        expect(dropdown.options.length).toBe(3); // Includes "Select a Saved City"
        expect(dropdown.options[1].textContent).toBe('New York, US');
        expect(dropdown.options[2].textContent).toBe('Los Angeles, US');
    });
});
