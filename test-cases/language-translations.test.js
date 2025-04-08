// Import required modules
const { translateText } = require('../javascript/settings.js');
const { translateWeatherDescription } = require('../feels-like/feelsLikeDisplay.js');

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
const LANGUAGE_KEY = 'clime-mate-language';

describe('Language Translation Tests', () => {
  
  // Reset localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });
  
  describe('Basic Translation Functionality', () => {
    test('translateText should return English text when language is set to English', () => {
      localStorage.setItem(LANGUAGE_KEY, 'en');
      
      expect(translateText('high')).toBe('High');
      expect(translateText('low')).toBe('Low');
      expect(translateText('rainSum')).toBe('Rain Sum');
      expect(translateText('snowSum')).toBe('Snow Sum');
      expect(translateText('sunrise')).toBe('Sunrise');
      expect(translateText('sunset')).toBe('Sunset');
    });
    
    test('translateText should return Spanish text when language is set to Spanish', () => {
      localStorage.setItem(LANGUAGE_KEY, 'es');
      
      expect(translateText('high')).toBe('Máxima');
      expect(translateText('low')).toBe('Mínima');
      expect(translateText('rainSum')).toBe('Lluvia');
      expect(translateText('snowSum')).toBe('Nieve');
      expect(translateText('sunrise')).toBe('Amanecer');
      expect(translateText('sunset')).toBe('Atardecer');
    });
    
    test('translateText should return French text when language is set to French', () => {
      localStorage.setItem(LANGUAGE_KEY, 'fr');
      
      expect(translateText('high')).toBe('Maximale');
      expect(translateText('low')).toBe('Minimale');
      expect(translateText('rainSum')).toBe('Pluie');
      expect(translateText('snowSum')).toBe('Neige');
      expect(translateText('sunrise')).toBe('Lever du soleil');
      expect(translateText('sunset')).toBe('Coucher du soleil');
    });
    
    test('translateText should return German text when language is set to German', () => {
      localStorage.setItem(LANGUAGE_KEY, 'de');
      
      expect(translateText('high')).toBe('Höchst');
      expect(translateText('low')).toBe('Tiefst');
      expect(translateText('rainSum')).toBe('Regen');
      expect(translateText('snowSum')).toBe('Schnee');
      expect(translateText('sunrise')).toBe('Sonnenaufgang');
      expect(translateText('sunset')).toBe('Sonnenuntergang');
    });
    
    test('translateText should default to English when language is not set', () => {
      // Don't set language in localStorage
      
      expect(translateText('high')).toBe('High');
      expect(translateText('low')).toBe('Low');
      expect(translateText('rainSum')).toBe('Rain Sum');
      expect(translateText('snowSum')).toBe('Snow Sum');
    });
    
    test('translateText should fallback to English when key is not found in selected language', () => {
      localStorage.setItem(LANGUAGE_KEY, 'es');
      
      // Assume this key doesn't exist in Spanish translations
      expect(translateText('nonExistentKey')).toBe('nonExistentKey');
    });
  });
  
  describe('Weather Description Translations', () => {
    test('translateWeatherDescription should return original text for English', () => {
      localStorage.setItem(LANGUAGE_KEY, 'en');
      
      expect(translateWeatherDescription('clear sky')).toBe('clear sky');
      expect(translateWeatherDescription('few clouds')).toBe('few clouds');
      expect(translateWeatherDescription('light rain')).toBe('light rain');
      expect(translateWeatherDescription('heavy snow')).toBe('heavy snow');
    });
    
    test('translateWeatherDescription should translate to Spanish', () => {
      localStorage.setItem(LANGUAGE_KEY, 'es');
      
      expect(translateWeatherDescription('clear sky')).toBe('cielo despejado');
      expect(translateWeatherDescription('few clouds')).toBe('pocas nubes');
      expect(translateWeatherDescription('light rain')).toBe('lluvia ligera');
      expect(translateWeatherDescription('heavy snow')).toBe('nevada intensa');
    });
    
    test('translateWeatherDescription should translate to French', () => {
      localStorage.setItem(LANGUAGE_KEY, 'fr');
      
      expect(translateWeatherDescription('clear sky')).toBe('ciel dégagé');
      expect(translateWeatherDescription('few clouds')).toBe('quelques nuages');
      expect(translateWeatherDescription('light rain')).toBe('pluie légère');
      expect(translateWeatherDescription('heavy snow')).toBe('neige abondante');
    });
    
    test('translateWeatherDescription should translate to German', () => {
      localStorage.setItem(LANGUAGE_KEY, 'de');
      
      expect(translateWeatherDescription('clear sky')).toBe('klarer Himmel');
      expect(translateWeatherDescription('few clouds')).toBe('wenige Wolken');
      expect(translateWeatherDescription('light rain')).toBe('leichter Regen');
      expect(translateWeatherDescription('heavy snow')).toBe('starker Schneefall');
    });
    
    test('translateWeatherDescription should handle case insensitivity', () => {
      localStorage.setItem(LANGUAGE_KEY, 'es');
      
      expect(translateWeatherDescription('Clear Sky')).toBe('cielo despejado');
      expect(translateWeatherDescription('LIGHT RAIN')).toBe('lluvia ligera');
    });
    
    test('translateWeatherDescription should handle partial matches', () => {
      localStorage.setItem(LANGUAGE_KEY, 'fr');
      
      expect(translateWeatherDescription('clear sky with some haze')).toBe('ciel dégagé with some haze');
      expect(translateWeatherDescription('mostly cloudy with light rain')).toBe('mostly nuageux with pluie légère');
    });
    
    test('translateWeatherDescription should return original text when no translation is found', () => {
      localStorage.setItem(LANGUAGE_KEY, 'es');
      
      expect(translateWeatherDescription('unusual weather condition')).toBe('unusual weather condition');
    });
  });
  
  describe('UI Element Translations', () => {
    test('should translate settings page elements', () => {
      localStorage.setItem(LANGUAGE_KEY, 'es');
      
      expect(translateText('settingsTitle')).toBe('Configuración de Clime-Mate');
      expect(translateText('selectTheme')).toBe('Seleccionar Tema');
      expect(translateText('lightTheme')).toBe('Tema Claro');
      expect(translateText('darkTheme')).toBe('Tema Oscuro');
      expect(translateText('saveSettings')).toBe('Guardar Configuración');
    });
    
    test('should translate weather alerts', () => {
      localStorage.setItem(LANGUAGE_KEY, 'fr');
      
      expect(translateText('weatherAlerts')).toBe('Alertes Météo');
      expect(translateText('enableAlerts')).toBe('Activer les Alertes Météo');
      expect(translateText('noAlerts')).toBe('Il n\'y a actuellement aucune alerte météo.');
      expect(translateText('weatherAlert')).toBe('Alerte Météo');
      expect(translateText('severeWeatherAlert')).toBe('Alerte Météo Sévère');
    });
    
    test('should translate error messages', () => {
      localStorage.setItem(LANGUAGE_KEY, 'de');
      
      expect(translateText('errorFetchingData')).toBe('Fehler beim Abrufen der Wetterdaten. Bitte versuchen Sie es erneut.');
      expect(translateText('geolocationError')).toBe('Geolokalisierungsfehler');
      expect(translateText('geolocationNotSupported')).toBe('Die Geolokalisierung wird von diesem Browser nicht unterstützt.');
    });
    
    test('should translate feels like component', () => {
      localStorage.setItem(LANGUAGE_KEY, 'es');
      
      expect(translateText('feelsLike')).toBe('Sensación Térmica');
      expect(translateText('hourlyForecast')).toBe('Pronóstico por Hora');
      expect(translateText('pleaseEnterCity')).toBe('Por favor, ingrese una ciudad');
    });
  });
});
