export default {
  testTimeout: 25000,
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(jpg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testEnvironmentOptions: {
    customExportConditions: [''],
    url: 'http://localhost'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-router|react-router-dom)'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(mp3|wav|ogg)$': '<rootDir>/src/__mocks__/audioMock.js', // Add this line
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-router|react-router-dom)/)'
  ]
};