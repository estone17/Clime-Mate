const { createWeatherCard, fetchWeatherData, createTodayWeatherCard } = require('../javascript/api-request.js');
const {translateText, formatTemperature, convertTemperature, applyTranslations, saveSettings, initSettings} = require('../javascript/settings.js');

// Mock localStorage
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: function() {
            store = {};
        },
        removeItem: jest.fn(key => {
            delete store[key];
        })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock document elements for settings functions
document.getElementById = jest.fn().mockImplementation((id) => {
    if (id === 'temp-unit-selector' || id === 'language-selector') {
        return { value: 'test-value' };
    }
    if (id === 'save-confirmation') {
        return { style: { display: 'none' } };
    }
    return null;
});


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



// Unit Conversion Logic Tests
describe('Temperature Conversion Functions', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    describe('convertTemperature', () => {
        test('should return celsius value when unit is set to celsius', () => {
            localStorageMock.getItem.mockReturnValueOnce('celsius');
            const result = convertTemperature(25);
            expect(result).toBe(25);
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-temp-unit');
        });

        test('should convert to fahrenheit when unit is set to fahrenheit', () => {
            localStorageMock.getItem.mockReturnValueOnce('fahrenheit');
            const result = convertTemperature(25);
            expect(result).toBe(77); // (25 * 9/5) + 32 = 77
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-temp-unit');
        });

        test('should default to fahrenheit when no unit is set', () => {
            localStorageMock.getItem.mockReturnValueOnce(null);
            const result = convertTemperature(25);
            expect(result).toBe(77); // (25 * 9/5) + 32 = 77
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-temp-unit');
        });
    });

    describe('formatTemperature', () => {
        test('should format temperature with celsius symbol when unit is set to celsius', () => {
            localStorageMock.getItem.mockReturnValueOnce('celsius');
            const result = formatTemperature(25.4);
            expect(result).toBe('25°C');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-temp-unit');
        });

        test('should format temperature with fahrenheit symbol when unit is set to fahrenheit', () => {
            localStorageMock.getItem.mockReturnValueOnce('fahrenheit');
            const result = formatTemperature(77.6);
            expect(result).toBe('78°F'); // Rounded to nearest integer
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-temp-unit');
        });

        test('should default to fahrenheit when no unit is set', () => {
            localStorageMock.getItem.mockReturnValueOnce(null);
            const result = formatTemperature(77.6);
            expect(result).toBe('78°F'); // Rounded to nearest integer
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-temp-unit');
        });
    });
});

// Language Preferences Tests
describe('Language Preference Functions', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    describe('translateText', () => {
        test('should return translated text for the specified key in English', () => {
            localStorageMock.getItem.mockReturnValueOnce('en');
            const result = translateText('high');
            expect(result).toBe('High');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-language');
        });

        test('should return translated text for the specified key in Spanish', () => {
            localStorageMock.getItem.mockReturnValueOnce('es');
            const result = translateText('high');
            expect(result).toBe('Máxima');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-language');
        });

        test('should return translated text for the specified key in French', () => {
            localStorageMock.getItem.mockReturnValueOnce('fr');
            const result = translateText('high');
            expect(result).toBe('Maximale');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-language');
        });

        test('should return translated text for the specified key in German', () => {
            localStorageMock.getItem.mockReturnValueOnce('de');
            const result = translateText('high');
            expect(result).toBe('Höchst');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-language');
        });

        test('should default to English when no language is set', () => {
            localStorageMock.getItem.mockReturnValueOnce(null);
            const result = translateText('high');
            expect(result).toBe('High');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-language');
        });

        test('should return the key itself when translation is not found', () => {
            localStorageMock.getItem.mockReturnValueOnce('en');
            const result = translateText('nonexistentKey');
            expect(result).toBe('nonexistentKey');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('clime-mate-language');
        });
    });

    describe('applyTranslations', () => {
        beforeEach(() => {
            // Mock document elements and querySelector
            document.querySelector = jest.fn().mockImplementation((selector) => {
                return { textContent: '' };
            });
            document.querySelectorAll = jest.fn().mockImplementation((selector) => {
                return [{ textContent: '' }, { textContent: '' }, { textContent: '' }];
            });
            document.title = '';
        });

        test('should apply English translations to the page', () => {
            applyTranslations('en');
            expect(document.title).toContain('Clime-Mate Settings');
        });

        test('should apply Spanish translations to the page', () => {
            applyTranslations('es');
            expect(document.title).toContain('Configuración de Clime-Mate');
        });

        test('should do nothing if language is not supported', () => {
            const originalTitle = document.title;
            applyTranslations('invalidLanguage');
            expect(document.title).toBe(originalTitle);
        });
    });
});

// Save Settings Tests
describe('Settings Management Functions', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
        
        // Reset mocks for DOM elements
        document.getElementById.mockClear();
        
        // Mock setTimeout
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('saveSettings', () => {
        test('should save temperature unit and language to localStorage', () => {
            // Setup mocks for DOM elements
            document.getElementById.mockImplementation((id) => {
                if (id === 'temp-unit-selector') return { value: 'celsius' };
                if (id === 'language-selector') return { value: 'fr' };
                if (id === 'save-confirmation') return { style: { display: 'none' } };
                return null;
            });

            saveSettings();

            expect(localStorageMock.setItem).toHaveBeenCalledWith('clime-mate-temp-unit', 'celsius');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('clime-mate-language', 'fr');
        });

        test('should show and hide confirmation message', () => {
            // Setup mocks for DOM elements
            const saveConfirmation = { style: { display: 'none' } };
            document.getElementById.mockImplementation((id) => {
                if (id === 'temp-unit-selector') return { value: 'celsius' };
                if (id === 'language-selector') return { value: 'fr' };
                if (id === 'save-confirmation') return saveConfirmation;
                return null;
            });

            saveSettings();

            expect(saveConfirmation.style.display).toBe('inline');
            
            // Fast-forward time to trigger the setTimeout callback
            jest.advanceTimersByTime(3000);
            
            expect(saveConfirmation.style.display).toBe('none');
        });

        test('should do nothing if selectors are not found', () => {
            // Setup mocks to return null for DOM elements
            document.getElementById.mockImplementation(() => null);

            saveSettings();

            expect(localStorageMock.setItem).not.toHaveBeenCalled();
        });
    });

    describe('initSettings', () => {
        test('should initialize with default values when no saved settings exist', () => {
            // Setup mocks for DOM elements
            const tempUnitSelector = { value: '' };
            const languageSelector = { value: '' };
            
            document.getElementById.mockImplementation((id) => {
                if (id === 'temp-unit-selector') return tempUnitSelector;
                if (id === 'language-selector') return languageSelector;
                return null;
            });

            // Mock localStorage to return null (no saved settings)
            localStorageMock.getItem.mockReturnValue(null);

            initSettings();

            expect(tempUnitSelector.value).toBe('fahrenheit');
            expect(languageSelector.value).toBe('en');
        });

        test('should load saved settings from localStorage', () => {
            // Setup mocks for DOM elements
            const tempUnitSelector = { value: '' };
            const languageSelector = { value: '' };
            
            document.getElementById.mockImplementation((id) => {
                if (id === 'temp-unit-selector') return tempUnitSelector;
                if (id === 'language-selector') return languageSelector;
                return null;
            });

            // Mock localStorage to return saved settings
            localStorageMock.getItem.mockImplementationOnce(() => 'celsius')
                           .mockImplementationOnce(() => 'de');

            initSettings();

            expect(tempUnitSelector.value).toBe('celsius');
            expect(languageSelector.value).toBe('de');
        });
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
