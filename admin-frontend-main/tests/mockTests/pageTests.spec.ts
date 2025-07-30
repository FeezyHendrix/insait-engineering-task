import { defaultPageUrl } from '../utils/testsConstants';
import { coverageTest, coverageExpect } from './baseFixtures';

coverageTest('chats page has data', async ({ page }) => {
  await page.goto(defaultPageUrl);
  await page.waitForLoadState('networkidle');
  const chatsTab = page.getByText('Chats');
  await chatsTab.click();
  const tbody = page.locator('tbody');
  await coverageExpect(tbody).toBeInViewport();  
  await tbody.waitFor({ state: 'visible' });
  const rowCount = await tbody.locator('tr').count();  
  coverageExpect(rowCount).toBeGreaterThan(0);
});

coverageTest('c. sessions page has data', async ({ page }) => {
  await page.goto(defaultPageUrl);
  await page.waitForLoadState('networkidle');
  const completedSessionsTab = page.getByText('Completed Sessions');
  await completedSessionsTab.click();
  const tbody = page.locator('tbody');
  await tbody.waitFor({ state: 'visible' });
  await coverageExpect(tbody).toBeInViewport();  
  const rowCount = await tbody.locator('tr').count();  
  coverageExpect(rowCount).toBeGreaterThan(0);
});
