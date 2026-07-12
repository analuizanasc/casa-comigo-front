/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e-tests/'],
  setupFiles: ['<rootDir>/jest.polyfills.cjs'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif|ico)$': '<rootDir>/src/__mocks__/fileMock.ts',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          module: 'commonjs',
          moduleResolution: 'node',
          allowImportingTsExtensions: false,
          noEmit: false,
        },
        diagnostics: false,
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/api/**',
    '!src/main.tsx',
    '!src/App.tsx',
    '!src/vite-env.d.ts',
    '!src/types/index.ts',
  ],
  coverageThresholds: {
    global: {
      statements: 95,
      branches: 88,
      functions: 99,
      lines: 97,
    },
  },
  coverageReporters: ['text', 'lcov'],
  clearMocks: true,
  restoreMocks: true,
};
