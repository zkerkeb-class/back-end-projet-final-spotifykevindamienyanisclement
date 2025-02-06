import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageDirectory: 'coverage',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
};

export default config;
