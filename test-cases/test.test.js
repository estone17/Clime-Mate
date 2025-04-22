const { createWeatherCard, fetchWeatherData, createTodayWeatherCard } = require('../javascript/api-request.js');
const {translateText, formatTemperature, convertTemperature, applyTranslations, saveSettings, initSettings} = require('../javascript/settings.js');

//weather card test
describe('createWeatherCard', () => {
    const date = '2025-03-01';
    const iconSrc = 'images/icons/cloudy-day.png';
    const highTemp = 75;
    const lowTemp = 32;
    const rainSum = 10;
    const snowSum = 5;
    const sunrise = '6:00 AM';
    const sunset = '7:00 PM';

    let card;

    beforeEach(() => {
        card = createWeatherCard(date, iconSrc, highTemp, lowTemp, rainSum, snowSum, sunrise, sunset);
    });

    test('returns a card element', () => {
        expect(card).toBeInstanceOf(HTMLElement);
        expect(card.className).toContain('card text-center');
    });


    test('includes correct icon src', () => {
        const img = card.querySelector('img');
        expect(img.src).toContain(iconSrc);
        expect(img.alt).toBe('Weather Icon');
    });

    test('includes high and low temperature', () => {
        const tempText = card.querySelector('.card-text.card-margin');
        expect(tempText.innerHTML).toContain('<u>High: 75°F | Low: 32°F</u>');

    });
});


//today card test
describe('createTodayWeatherCard', () => {
    const date = '2025-03-01';
    const iconSrc = 'images/icons/cloudy-day.png';
    const highTemp = 75;
    const lowTemp = 32;
    const rainSum = 10;
    const snowSum = 5;
    const sunrise = '6:00 AM';
    const sunset = '7:00 PM';

    let card;

    beforeEach(() => {
        card = createTodayWeatherCard(date, iconSrc, highTemp, lowTemp, rainSum, snowSum, sunrise, sunset);
    });

    test('returns a card element', () => {
        expect(card).toBeInstanceOf(HTMLElement);
        expect(card.className).toContain('card text-center');
    });


    test('includes correct icon src', () => {
        const img = card.querySelector('img');
        expect(img.src).toContain(iconSrc);
        expect(img.alt).toBe('Weather Icon');
    });

    test('includes high and low temperature', () => {
        const tempText = card.querySelector('.card-text');
        expect(tempText.innerHTML).toContain('<strong>High:</strong> 75°F | <strong>Low:</strong> 32°F');

    });
});

//weather api test
// Mock the global fetch function
global.fetch = jest.fn();

describe('fetchWeatherData', () => {
    const lat = 35.2271; 
    const lon = -80.8431; 

    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    test('should return data when the API call is successful', async () => {
        const mockResponse = {
            daily: {
                temperature_2m_max: [75, 78, 80],
                temperature_2m_min: [50, 52, 55],
                rain_sum: [0.2, 0.0, 0.1],
                snowfall_sum: [0, 0, 0],
                sunrise: ['06:30 AM', '06:35 AM', '06:40 AM'],
                sunset: ['07:30 PM', '07:35 PM', '07:40 PM']
            }
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponse)
        });

        const data = await fetchWeatherData(lat, lon);

        expect(fetch).toHaveBeenCalledWith(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum,sunrise,sunset&timezone=auto&forecast_days=7`
        );
        expect(data).toEqual(mockResponse); 
    });

    test('should return null when the API call fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });

        const data = await fetchWeatherData(lat, lon);

        expect(fetch).toHaveBeenCalledWith(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum,sunrise,sunset&timezone=auto&forecast_days=7`
        );
        expect(data).toBeNull(); // Ensure null is returned on failure
    });

    test('should return null when there is an error in the fetch call', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const data = await fetchWeatherData(lat, lon);

        expect(fetch).toHaveBeenCalledWith(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum,sunrise,sunset&timezone=auto&forecast_days=7`
        );
        expect(data).toBeNull(); // Ensure null is returned on error
    });
});
