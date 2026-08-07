module.exports = {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          jsx: "react-jsx",
          esModuleInterop: true,
        },
      },
    ],
  },
  collectCoverageFrom: [
    "src/actions/testerGuide.ts",
    "src/reducers/testerGuide.ts",
    "src/lib/tester-guide-export.ts",
  ],
};
