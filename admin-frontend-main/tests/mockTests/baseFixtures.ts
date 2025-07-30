import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { BrowserContext, test as baseTest } from '@playwright/test';

const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output');

export function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex');
}

export const coverageTest = baseTest.extend<{
  context: BrowserContext;
}>({
  context: async ({ browser }, use) => {
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });

    const context = await browser.newContext();

    await context.addInitScript(() => {
      window.addEventListener('beforeunload', () =>
        (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__))
      );
    });

    await context.exposeFunction('collectIstanbulCoverage', (coverageJSON: string) => {
      if (coverageJSON) {
        const filePath = path.join(istanbulCLIOutput, `playwright_coverage_${generateUUID()}.json`);
        fs.writeFileSync(filePath, coverageJSON);
      }
    });

    await use(context);

    for (const page of context.pages()) {
      await page.evaluate(() => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)));
    }

    await context.close();
  },
});

export const coverageExpect = coverageTest.expect;
export const playwrightTest = baseTest;
export const playwrightExpect = baseTest.expect;