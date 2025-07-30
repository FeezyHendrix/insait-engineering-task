import { defineConfig } from '@playwright/test';
// import { FRONTEND_URL } from './tests/utils/testsConstants';

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export default defineConfig({
  webServer: {
    command: 'npm run dev',
    // url: FRONTEND_URL,
    // reuseExistingServer: true,
  },
  testDir: './tests/mockTests',
  use: {
    // baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    ignoreHTTPSErrors: true, 
    launchOptions: {
      args: ['--disable-cache', '--disable-application-cache'], 
    },
  },
  expect: {
    timeout: 2 * 60 * 1000,
  },

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 4 : undefined,

  reporter: process.env.CI
    ? [['list'], ['junit', { outputFile: 'junit-results.xml' }]]
    : [['list'], ['html', { open: 'on-failure' }]],

  outputDir: 'test-results/',
});
