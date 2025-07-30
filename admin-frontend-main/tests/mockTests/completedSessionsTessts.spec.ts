import { defaultPageUrl } from '../utils/testsConstants';
import { coverageTest, coverageExpect } from './baseFixtures';

coverageTest('completed sesstions page has data', async ({ page }) => {
  await page.goto(defaultPageUrl);
  await page.waitForLoadState('networkidle');
  const chatsTab = page.getByText('Completed Sessions');
  await chatsTab.click();
  const tbody = page.locator('tbody');
  await coverageExpect(tbody).toBeInViewport();  
  await tbody.waitFor({ state: 'visible' });
  const rowCount = await tbody.locator('tr').count();  
  coverageExpect(rowCount).toBeGreaterThan(0);
});

coverageTest('finds searched session', async ({ page }) => {
    await page.goto(defaultPageUrl);
    await page.waitForLoadState('networkidle');
    const chatsTab = page.getByText('Completed Sessions');
    await chatsTab.click();
    const searchInput = page.locator('input[placeholder="Search sessions"]');
    await coverageExpect(searchInput).toBeInViewport();  
    await searchInput.fill('reagan');
    const tbody = page.locator('tbody');
    await tbody.waitFor({ state: 'visible' });
    const filteredRowCount = await tbody.locator('tr').count();
    coverageExpect(filteredRowCount).toBeGreaterThan(0);
    const firstRowText = await tbody.locator('tr').first().textContent();
    coverageExpect(firstRowText).toContain('moore@gmail.com');
});