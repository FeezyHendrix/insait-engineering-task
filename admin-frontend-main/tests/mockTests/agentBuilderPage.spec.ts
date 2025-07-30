import { defaultPageUrl } from '../utils/testsConstants'
import { coverageTest, coverageExpect } from './baseFixtures'

coverageTest.describe('Agent Builder Field Panel Tests', () => {
  coverageTest.beforeEach(async ({ page }) => {
    await page.goto(defaultPageUrl)
    await page.waitForLoadState('networkidle')

    const agentBuilderTab = page.getByRole('link', {
      name: 'Agent Builder',
    })

    await agentBuilderTab.click()

    await page.waitForSelector('.react-flow__renderer', { timeout: 10000 })
  })

  coverageTest(
    'Verify Toolbar contains Talk and Listen sections',
    async ({ page }) => {
      const toolbar = page.locator('#builder-toolbar')

      await coverageExpect(toolbar).toBeVisible()

      const talkSection = toolbar.locator('div:has-text("Talk")').first()
      await coverageExpect(talkSection).toBeVisible()

      const listenSection = toolbar.locator('div:has-text("Listen")').first()
      await coverageExpect(listenSection).toBeVisible()

      const talkButton = page.locator('div:has-text("Talk")').first()
      if ((await talkButton.count()) > 0) {
        await talkButton.click({ force: true })
        await page.waitForTimeout(500)
      }

      const listenButton = page.locator('div:has-text("Listen")').first()
      if ((await listenButton.count()) > 0) {
        await listenButton.click({ force: true })
        await page.waitForTimeout(500)
      }
    }
  )

  coverageTest('Verify flow selector UI elements', async ({ page }) => {
    const flowSelector = page
      .getByRole('combobox')
      .filter({ hasText: 'New Flow' })
    await coverageExpect(flowSelector).toBeVisible()
  })
})
