/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	// globalTeardown: "<rootDir>/src/setupFilesAfterEnv.ts",
	setupFilesAfterEnv: ["<rootDir>/src/setupFilesAfterEnv.ts"],
	modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
