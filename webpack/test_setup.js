import 'core-js/shim';
import 'regenerator-runtime/runtime';

// Mocking translation function
global.__ = text => text; // eslint-disable-line

// Mocking locales to prevent unnecessary fallback messages
window.locales = { en: { domain: 'app', locale_data: { app: { '': {} } } } };
