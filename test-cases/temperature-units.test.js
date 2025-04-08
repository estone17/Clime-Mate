// Import required modules
const { convertTemperature, formatTemperature } = require('../javascript/settings.js');
const { getUnitsParameter } = require('../feels-like/feelsLike.js');

// Mock localStorage for testing
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
})();

// Replace global localStorage with mock
global.localStorage = localStorageMock;

// Constants for localStorage keys
const TEMP_UNIT_KEY = 'clime-mate-temp-unit';

describe('Temperature Unit Conversion Tests', () => {
  
  // Reset localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });
  
  describe('Temperature Conversion Functions', () => {
    test('convertTemperature should return Celsius value when unit is set to celsius', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      
      // Input is already in Celsius, should return the same value
      expect(convertTemperature(0)).toBe(0);
      expect(convertTemperature(20)).toBe(20);
      expect(convertTemperature(-10)).toBe(-10);
      expect(convertTemperature(37.5)).toBe(37.5);
    });
    
    test('convertTemperature should convert to Fahrenheit when unit is set to fahrenheit', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'fahrenheit');
      
      // Formula: (C * 9/5) + 32
      expect(convertTemperature(0)).toBe(32); // 0°C = 32°F
      expect(convertTemperature(20)).toBe(68); // 20°C = 68°F
      expect(convertTemperature(-10)).toBe(14); // -10°C = 14°F
      expect(convertTemperature(37.5)).toBe(99.5); // 37.5°C = 99.5°F
    });
    
    test('convertTemperature should default to Fahrenheit when unit is not set', () => {
      // Don't set temperature unit in localStorage
      
      // Formula: (C * 9/5) + 32
      expect(convertTemperature(0)).toBe(32);
      expect(convertTemperature(20)).toBe(68);
    });
    
    test('formatTemperature should format Celsius values with °C symbol', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      
      expect(formatTemperature(0)).toBe('0°C');
      expect(formatTemperature(20)).toBe('20°C');
      expect(formatTemperature(-10)).toBe('-10°C');
      expect(formatTemperature(37.5)).toBe('38°C'); // Rounded to nearest integer
    });
    
    test('formatTemperature should format Fahrenheit values with °F symbol', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'fahrenheit');
      
      expect(formatTemperature(32)).toBe('32°F');
      expect(formatTemperature(68)).toBe('68°F');
      expect(formatTemperature(14)).toBe('14°F');
      expect(formatTemperature(99.5)).toBe('100°F'); // Rounded to nearest integer
    });
    
    test('formatTemperature should round to nearest integer', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      
      expect(formatTemperature(20.2)).toBe('20°C');
      expect(formatTemperature(20.5)).toBe('21°C');
      expect(formatTemperature(20.7)).toBe('21°C');
      
      localStorage.setItem(TEMP_UNIT_KEY, 'fahrenheit');
      
      expect(formatTemperature(68.2)).toBe('68°F');
      expect(formatTemperature(68.5)).toBe('69°F');
      expect(formatTemperature(68.7)).toBe('69°F');
    });
  });
  
  describe('API Units Parameter', () => {
    test('getUnitsParameter should return "metric" when unit is set to celsius', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      
      expect(getUnitsParameter()).toBe('metric');
    });
    
    test('getUnitsParameter should return "imperial" when unit is set to fahrenheit', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'fahrenheit');
      
      expect(getUnitsParameter()).toBe('imperial');
    });
    
    test('getUnitsParameter should default to "imperial" when unit is not set', () => {
      // Don't set temperature unit in localStorage
      
      expect(getUnitsParameter()).toBe('imperial');
    });
  });
  
  describe('Temperature Display Integration', () => {
    // Mock the DOM elements and functions needed for testing
    const mockElement = {
      innerText: '',
      innerHTML: ''
    };
    
    global.document = {
      getElementById: jest.fn().mockImplementation(() => mockElement)
    };
    
    test('should display temperatures in Celsius format when unit is set to celsius', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      
      // Test a function that would display temperature
      function displayTemp(temp) {
        const element = document.getElementById('temp-display');
        element.innerText = formatTemperature(temp);
        return element.innerText;
      }
      
      expect(displayTemp(20)).toBe('20°C');
      expect(displayTemp(-5)).toBe('-5°C');
    });
    
    test('should display temperatures in Fahrenheit format when unit is set to fahrenheit', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'fahrenheit');
      
      // Test a function that would display temperature
      function displayTemp(temp) {
        const element = document.getElementById('temp-display');
        element.innerText = formatTemperature(temp);
        return element.innerText;
      }
      
      expect(displayTemp(68)).toBe('68°F');
      expect(displayTemp(23)).toBe('23°F');
    });
    
    test('should convert and format temperatures correctly', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      
      // Test a function that would convert and display temperature
      function convertAndDisplayTemp(tempCelsius) {
        const convertedTemp = convertTemperature(tempCelsius);
        const element = document.getElementById('temp-display');
        element.innerText = formatTemperature(convertedTemp);
        return element.innerText;
      }
      
      expect(convertAndDisplayTemp(20)).toBe('20°C');
      
      localStorage.setItem(TEMP_UNIT_KEY, 'fahrenheit');
      
      expect(convertAndDisplayTemp(20)).toBe('68°F');
    });
  });
  
  describe('Edge Cases', () => {
    test('should handle extreme temperatures', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      
      expect(formatTemperature(100)).toBe('100°C'); // Very hot
      expect(formatTemperature(-100)).toBe('-100°C'); // Very cold
      
      localStorage.setItem(TEMP_UNIT_KEY, 'fahrenheit');
      
      expect(convertTemperature(100)).toBe(212); // 100°C = 212°F
      expect(convertTemperature(-100)).toBe(-148); // -100°C = -148°F
    });
    
    test('should handle decimal precision', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      
      expect(formatTemperature(20.123456789)).toBe('20°C');
      
      localStorage.setItem(TEMP_UNIT_KEY, 'fahrenheit');
      
      // 20.123456789°C = 68.22222222°F, rounded to 68°F
      expect(formatTemperature(convertTemperature(20.123456789))).toBe('68°F');
    });
    
    test('should handle non-numeric inputs gracefully', () => {
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      
      // NaN should be treated as 0 or handled specially
      expect(formatTemperature(NaN)).toBe('NaN°C');
      
      // Strings that can be converted to numbers should work
      expect(convertTemperature('20')).toBe(20);
      
      localStorage.setItem(TEMP_UNIT_KEY, 'fahrenheit');
      
      expect(convertTemperature('20')).toBe(68);
    });
  });
});
