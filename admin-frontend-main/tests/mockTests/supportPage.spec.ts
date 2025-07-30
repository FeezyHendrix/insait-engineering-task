import { defaultPageUrl } from '../utils/testsConstants';
import { coverageTest, coverageExpect } from './baseFixtures';

coverageTest.describe('Contact Support Table Filter Tests', () => {
  coverageTest('Table updates when search input changes', async ({ page }) => {
    await page.goto(defaultPageUrl);
    await page.waitForLoadState('networkidle');
    const contactSupportTab = page.locator('span.nav-title:has-text("Contact Support")');
    await contactSupportTab.click();
   
    const searchInput = page.locator('input[placeholder="Search messages"]');

    await searchInput.press("T");
    await searchInput.press("E");
    await searchInput.press("S");
    await searchInput.press("T");

    await page.waitForTimeout(2000);
    
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const rowText = await rows.nth(i).innerText();
      coverageExpect(rowText).toContain('Test');
    }
  });
});
