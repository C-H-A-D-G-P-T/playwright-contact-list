// @ts-check
import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
	testDir: "./tests",

	fullyParallel: true,
	workers: 1,
	retries: 3,
	reporter: "html",

	use: {
		baseURL: "https://thinking-tester-contact-list.herokuapp.com",
		trace: "on-first-retry",
	},

	expect: {
		timeout: 10000
	},

	projects: [
		// ======================
		// UI PROJECTS (Browsers)
		// ======================
		{
			name: "chromium",
			testDir: "./tests/ui",
			use: {
				...devices["Desktop Chrome"],
			},
		},
		// {
		//   name: 'firefox',
		//   testDir: './tests/ui',
		//   use: {
		//     ...devices['Desktop Firefox'],
		//   },
		// },
		// {
		//   name: 'webkit',
		//   testDir: './tests/ui',
		//   use: {
		//     ...devices['Desktop Safari'],
		//   },
		// },

		// ======================
		// API PROJECT
		// ======================
		{
			name: "api",
			testDir: "./tests/api",
			use: {
				baseURL: "https://thinking-tester-contact-list.herokuapp.com",
			},
		},
	],
});
