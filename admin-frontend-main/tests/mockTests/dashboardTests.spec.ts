import { defaultPageUrl } from '../utils/testsConstants';
import { coverageTest, coverageExpect } from './baseFixtures';

coverageTest.describe('Table Filter Tests', () => {
    coverageTest('verify quick filters', async ({ page }) => {
        await page.goto(defaultPageUrl);
        await page.waitForLoadState('networkidle');
        const dashboardTab = page.locator('span.nav-title:has-text("Dashboard")');
        await dashboardTab.waitFor({ state: 'visible', timeout: 10000 }); 
        await dashboardTab.click(); 

        const selectDropdown = page.locator('[role="combobox"]');
        await selectDropdown.click();

        const todayOption = page.locator('li:has-text("Today")');
        await todayOption.click();

        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-GB');         

        const startDateInput = page.locator('div:has(p:text-is("Start Date")) input').first();
        await coverageExpect(startDateInput).toHaveValue(formattedDate);
        const endDateInput = page.locator('div:has(p:text-is("End Date")) input').first();
        await coverageExpect(endDateInput).toHaveValue(formattedDate);
    });

    coverageTest('verify expand/collapse sections', async ({ page }) => {
        await page.goto(defaultPageUrl);
        await page.waitForLoadState('networkidle');
        const dashboardTab = page.locator('span.nav-title:has-text("Dashboard")');
        await dashboardTab.highlight(); 
        await dashboardTab.click(); 
        
        const metricsButton = page.getByRole('tab', { name: 'Key Metrics' });
        await metricsButton.waitFor({ state: 'visible' });
        await metricsButton.click();

        const conversionSection = page.locator('.conversionContainer__title').first();
        await conversionSection.waitFor({ state: 'visible' });
        await conversionSection.click();

        const conversionContainer = page.locator('div.container').first();
        await coverageExpect(conversionContainer).toHaveClass(/container container_opened/); 
    });
});