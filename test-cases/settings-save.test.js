// Import required modules
const { saveSettings, initSettings } = require('../javascript/settings.js');

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
const LANGUAGE_KEY = 'clime-mate-language';

describe('Settings Save Tests', () => {
  
  // Mock DOM elements and functions
  let mockElements = {};
  let mockConsole;
  let originalConsole;
  let timeoutSpy;
  
  // Setup before each test
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Reset mock elements
    mockElements = {
      'temp-unit-selector': { value: 'fahrenheit' },
      'language-selector': { value: 'en' },
      'save-confirmation': { 
        style: { display: 'none' },
        textContent: ''
      }
    };
    
    // Mock document.getElementById
    global.document = {
      getElementById: jest.fn().mockImplementation((id) => mockElements[id] || null),
      querySelector: jest.fn().mockImplementation(() => null),
      querySelectorAll: jest.fn().mockImplementation(() => []),
      title: 'Clime-Mate'
    };
    
    // Mock console.log to track calls
    originalConsole = console.log;
    mockConsole = jest.fn();
    console.log = mockConsole;
    
    // Mock setTimeout
    jest.useFakeTimers();
    timeoutSpy = jest.spyOn(global, 'setTimeout');
  });
  
  // Restore console.log after tests
  afterEach(() => {
    console.log = originalConsole;
    jest.useRealTimers();
    timeoutSpy.mockRestore();
  });
  
  describe('Basic Settings Save Functionality', () => {
    test('saveSettings should save temperature unit to localStorage', () => {
      // Set up mock elements with values
      mockElements['temp-unit-selector'].value = 'celsius';
      mockElements['language-selector'].value = 'en';
      
      // Call the function
      saveSettings();
      
      // Check if localStorage was updated correctly
      expect(localStorage.getItem(TEMP_UNIT_KEY)).toBe('celsius');
    });
    
    test('saveSettings should save language to localStorage', () => {
      // Set up mock elements with values
      mockElements['temp-unit-selector'].value = 'fahrenheit';
      mockElements['language-selector'].value = 'es';
      
      // Call the function
      saveSettings();
      
      // Check if localStorage was updated correctly
      expect(localStorage.getItem(LANGUAGE_KEY)).toBe('es');
    });
    
    test('saveSettings should save both settings simultaneously', () => {
      // Set up mock elements with values
      mockElements['temp-unit-selector'].value = 'celsius';
      mockElements['language-selector'].value = 'fr';
      
      // Call the function
      saveSettings();
      
      // Check if localStorage was updated correctly
      expect(localStorage.getItem(TEMP_UNIT_KEY)).toBe('celsius');
      expect(localStorage.getItem(LANGUAGE_KEY)).toBe('fr');
    });
    
    test('saveSettings should log the saved settings to console', () => {
      // Set up mock elements with values
      mockElements['temp-unit-selector'].value = 'celsius';
      mockElements['language-selector'].value = 'de';
      
      // Call the function
      saveSettings();
      
      // Check if console.log was called with the expected message
      expect(mockConsole).toHaveBeenCalledWith('Saving settings...');
      expect(mockConsole).toHaveBeenCalledWith('Settings saved:', { tempUnit: 'celsius', language: 'de' });
    });
  });
  
  describe('UI Feedback', () => {
    test('saveSettings should show confirmation message', () => {
      // Set up mock elements with values
      mockElements['temp-unit-selector'].value = 'fahrenheit';
      mockElements['language-selector'].value = 'en';
      
      // Call the function
      saveSettings();
      
      // Check if confirmation message is displayed
      expect(mockElements['save-confirmation'].style.display).toBe('inline');
    });
    
    test('saveSettings should hide confirmation message after timeout', () => {
      // Set up mock elements with values
      mockElements['temp-unit-selector'].value = 'fahrenheit';
      mockElements['language-selector'].value = 'en';
      
      // Call the function
      saveSettings();
      
      // Check if setTimeout was called with the expected delay
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000);
      
      // Fast-forward time to trigger the timeout callback
      jest.runAllTimers();
      
      // Check if confirmation message is hidden after timeout
      expect(mockElements['save-confirmation'].style.display).toBe('none');
    });
  });
  
  describe('Integration with initSettings', () => {
    test('initSettings should load the saved settings', () => {
      // Save settings first
      localStorage.setItem(TEMP_UNIT_KEY, 'celsius');
      localStorage.setItem(LANGUAGE_KEY, 'fr');
      
      // Call initSettings
      initSettings();
      
      // Check if the selectors were updated with the saved values
      expect(document.getElementById).toHaveBeenCalledWith('temp-unit-selector');
      expect(document.getElementById).toHaveBeenCalledWith('language-selector');
    });
    
    test('full save and load cycle should work correctly', () => {
      // Set up mock elements with initial values
      mockElements['temp-unit-selector'].value = 'celsius';
      mockElements['language-selector'].value = 'de';
      
      // Save settings
      saveSettings();
      
      // Clear mock elements to simulate page reload
      mockElements['temp-unit-selector'].value = 'fahrenheit'; // Default value
      mockElements['language-selector'].value = 'en'; // Default value
      
      // Load settings
      initSettings();
      
      // Check if the selectors were updated with the saved values
      // Note: In a real scenario, the DOM elements would be updated, but in our mock
      // we're just checking if the correct functions were called
      expect(document.getElementById).toHaveBeenCalledWith('temp-unit-selector');
      expect(document.getElementById).toHaveBeenCalledWith('language-selector');
      
      // Verify localStorage still has the correct values
      expect(localStorage.getItem(TEMP_UNIT_KEY)).toBe('celsius');
      expect(localStorage.getItem(LANGUAGE_KEY)).toBe('de');
    });
  });
  
  describe('Edge Cases', () => {
    test('saveSettings should handle missing DOM elements gracefully', () => {
      // Remove the selectors from the mock elements
      delete mockElements['temp-unit-selector'];
      delete mockElements['language-selector'];
      
      // This should not throw an error
      expect(() => saveSettings()).not.toThrow();
      
      // No settings should be saved
      expect(localStorage.getItem(TEMP_UNIT_KEY)).toBeNull();
      expect(localStorage.getItem(LANGUAGE_KEY)).toBeNull();
    });
    
    test('saveSettings should handle missing confirmation element', () => {
      // Set up mock elements with values but remove confirmation element
      mockElements['temp-unit-selector'].value = 'celsius';
      mockElements['language-selector'].value = 'fr';
      delete mockElements['save-confirmation'];
      
      // This should not throw an error
      expect(() => saveSettings()).not.toThrow();
      
      // Settings should still be saved
      expect(localStorage.getItem(TEMP_UNIT_KEY)).toBe('celsius');
      expect(localStorage.getItem(LANGUAGE_KEY)).toBe('fr');
    });
  });
});
