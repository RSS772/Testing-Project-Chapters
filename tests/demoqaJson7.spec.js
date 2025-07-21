import { test, expect } from '@playwright/test';
import testdata from '../testdata.json' assert { type: 'json' };


for (const { fullName, email, currentAddress, permanentAddress } of testdata) {
  test(`Form submission and validation for ${fullName}`, async ({ page }) => {
    await page.goto('https://demoqa.com/text-box', { timeout: 60000 });

    // Fill the form
    await page.locator('#userName').fill(fullName);
    await page.locator('#userEmail').fill(email);
    await page.locator('#currentAddress').fill(currentAddress);
    await page.locator('#permanentAddress').fill(permanentAddress);

    // Submit the form
    await page.locator('#submit').click();

    // Validate displayed output
    const output = page.locator('#output');
    await expect(output.locator('p#name')).toContainText(fullName);
    await expect(output.locator('p#email')).toContainText(email);
    await expect(output.locator('p#currentAddress')).toContainText(currentAddress);
    await expect(output.locator('p#permanentAddress')).toContainText(permanentAddress);
  });
}
