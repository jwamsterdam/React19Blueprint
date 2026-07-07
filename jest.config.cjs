/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/*.{test,spec}.{ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.cjs',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  // Coverage is enforced on shared/ initially; expand per feature as WPs land.
  collectCoverageFrom: [
    'src/shared/**/*.{ts,tsx}',
    '!src/shared/**/*.stories.tsx',
    '!src/shared/**/*.d.ts',
    '!src/shared/i18n/**',
  ],
  coverageThreshold: {
    global: { statements: 80, branches: 75, functions: 85, lines: 80 },
  },
};
