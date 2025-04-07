// Import the functions from location-search/script.js
const { getTimeUntil, getUpcomingEvent, convertFahrenheitToCelsius, convertCelsiusToFahrenheit } = require('../location-search/script.js');

// Test for the getTimeUntil function
test('getTimeUntil should return the correct time difference', () => {
    const eventTime = new Date("2025-04-06T12:30:00Z").getTime(); // Event time (e.g., sunrise)
    const currentTime = new Date("2025-04-06T10:00:00Z").getTime(); // Current time
    const result = getTimeUntil(eventTime, currentTime);
    expect(result).toBe("2h 30m"); // Expected output
});

// Test for the getUpcomingEvent function
test('getUpcomingEvent should return the correct event and time until', () => {
    const sunriseTime = new Date("2025-04-06T06:00:00Z").getTime(); // Sunrise time
    const sunsetTime = new Date("2025-04-06T18:30:00Z").getTime(); // Sunset time
    const currentTime = new Date("2025-04-06T10:00:00Z").getTime(); // Current time

    const result = getUpcomingEvent(sunriseTime, sunsetTime, currentTime);
    expect(result.name).toBe("Sunset"); // Checking if the upcoming event is Sunset
    expect(result.timeUntil).toBe("8h 30m"); // Expected output for time until Sunset
});

// Test for getTimeUntil with same time (edge case)
test('getTimeUntil should return "0h 0m" when event time equals current time', () => {
    const eventTime = new Date("2025-04-06T12:00:00Z").getTime(); // Event time (e.g., sunrise)
    const currentTime = new Date("2025-04-06T12:00:00Z").getTime(); // Current time
    const result = getTimeUntil(eventTime, currentTime);
    expect(result).toBe("0h 0m"); // Expected output
});

// Test for getUpcomingEvent when current time is after sunset
test('getUpcomingEvent should return next day\'s sunrise if current time is after sunset', () => {
    const sunriseTime = new Date("2025-04-06T06:00:00Z").getTime(); // Sunrise time
    const sunsetTime = new Date("2025-04-06T18:30:00Z").getTime(); // Sunset time
    const currentTime = new Date("2025-04-06T19:00:00Z").getTime(); // Current time after sunset

    const result = getUpcomingEvent(sunriseTime, sunsetTime, currentTime);
    expect(result.name).toBe("Sunrise (next day)"); // Checking if the next day's sunrise is returned
    expect(result.timeUntil).toBe("11h 0m"); // Expected time until next day's sunrise
});