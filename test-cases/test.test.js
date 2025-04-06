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


