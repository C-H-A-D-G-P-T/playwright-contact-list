// @ts-check
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';


export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'https://thinking-tester-contact-list.herokuapp.com',
    trace: 'on-first-retry',
  },

  projects: [
    // ======================
    // UI PROJECTS (Browsers)
    // ======================
    // {
    //   name: 'chromium',
    //   testDir: './tests/ui',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     baseURL: 'http://localhost:3000',
    //   },
    // },
    // {
    //   name: 'firefox',
    //   testDir: './tests/ui',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     baseURL: 'http://localhost:3000',
    //   },
    // },
    // {
    //   name: 'webkit',
    //   testDir: './tests/ui',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     baseURL: 'http://localhost:3000',
    //   },
    // },

    // ======================
    // API PROJECT
    // ======================
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://thinking-tester-contact-list.herokuapp.com',
      },
    },
  ],
});