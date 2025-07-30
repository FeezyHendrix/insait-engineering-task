import {defaultPageUrl} from '../utils/testsConstants'
import { coverageTest, coverageExpect } from './baseFixtures';

coverageTest.describe('Chats Page Tests', () => {

  coverageTest('Chats page loads data and table is populated', async ({ page }) => {
    await page.goto(defaultPageUrl);
    await page.waitForLoadState('networkidle');

    const chatsTab = page.locator('span.nav-title:has-text("Chats")');
    await chatsTab.click();

    const table = page.locator('table');
    await coverageExpect(table).toBeVisible(); 

    const tbody = table.locator('tbody');
    await coverageExpect(tbody).toBeInViewport();
    await tbody.waitFor({ state: 'visible' });

    const rowCount = await tbody.locator('tr').count();
    coverageExpect(rowCount).toBeGreaterThan(0);
  });

  coverageTest('Pagination works correctly', async ({ page }) => {
    await page.goto(defaultPageUrl);
    await page.waitForLoadState('networkidle');
    const chatsTab = page.locator('span.nav-title:has-text("Chats")');
    await chatsTab.click();

    const nextPageButton = page.locator('[role="button"][aria-label="Next page"][rel="next"]');
    await nextPageButton.click();

    const firstRow = page.locator('tbody tr').first();
    await firstRow.waitFor({ state: 'visible' });

    const tbody = page.locator('table tbody');
    await tbody.waitFor({ state: 'visible' });

    const rowCount = await tbody.locator('tr').count();
    coverageExpect(rowCount).toBeGreaterThan(0);
  });

  coverageTest('Message icon click navigates to conversation', async ({ page }) => {
    await page.goto(defaultPageUrl);
    await page.waitForLoadState('networkidle');
    const chatsTab = page.locator('span.nav-title:has-text("Chats")');
    await chatsTab.click();

    const firstRowMessageIcon = page.locator('table tbody tr:nth-of-type(1) td:nth-of-type(7) .fullConversation-btn'); 
    await firstRowMessageIcon.click();

    const conversationModal = page.locator('text=Full Conversation');
    await conversationModal.waitFor({ state: 'visible' });
    await coverageExpect(conversationModal).toBeVisible();
  });

  coverageTest('Write Message in chat conversation', async ({page}) =>{
    await page.goto(defaultPageUrl);
    await page.waitForLoadState('networkidle');
    const chatsTab = page.locator('span.nav-title:has-text("Chats")');
    await chatsTab.click();

    const fullConversationButton = page.locator('table tbody tr:nth-of-type(1) td:nth-of-type(7) .fullConversation-btn'); 
    await fullConversationButton.click(); 

    const commentTextarea = page.locator('textarea[placeholder="Add comments on the conversation here..."]');
    await commentTextarea.press('h');
    await commentTextarea.press('i');

    });
});
