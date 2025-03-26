import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'node:util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('text-encoding');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};