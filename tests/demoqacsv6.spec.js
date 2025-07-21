import { test, chromium, expect } from '@playwright/test';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

// 1. Read and parse the CSV file
const csvData = fs.readFileSync('./Data.csv');
const records = parse(csvData, {
  columns: true,
  skip_empty_lines: true
});

test.describe.serial('Student Registration Form', () => {
  records.forEach((record, idx) => {
    test(`Demo - ${record.Id}`, async () => {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto("https://demoqa.com/automation-practice-form");

      // Fill the form
      await page.getByPlaceholder("First Name").fill(record.FirstName);
      await page.getByPlaceholder("Last Name").fill(record.LastName);
      await page.getByPlaceholder("name@example.com").fill(record.Email);
      await page.click(`//label[text()="${record.Gender}"]`);
      await page.getByPlaceholder("Mobile Number").fill(record.Mobile);
      await page.click(`//label[text()="${record.Hobbies}"]`);
      await page.getByPlaceholder("Current Address").fill(record.CurrentAddress);
     
    // Select State
      await page.locator("//div[@id='state']").click();
      const stateOption = await page.locator('.css-1n7v3ny-option', { hasText: record.State });
      await expect(stateOption).toBeVisible({ timeout: 5000 });
      await stateOption.click();

      // Select City
      await page.locator("//div[@id='city']").click();
      const cityOption= await page.locator('.css-1n7v3ny-option', { hasText: record.City });
      await expect(cityOption).toBeVisible({ timeout: 5000 });
      await cityOption.click();

      // Submit
      await page.locator("//button[@id='submit']").click();

      // Validate modal values
      let testResult = "Fail";
      try {
        await expect(page.locator('.modal-content')).toBeVisible({ timeout: 5000 });
        const modalText = await page.locator('.modal-content').textContent();

        if (
          modalText.includes(record.FirstName) &&
          modalText.includes(record.LastName) &&
          modalText.includes(record.Email) &&
          modalText.includes(record.Gender) &&
          modalText.includes(record.Mobile) &&
          modalText.includes(record.Hobbies) &&
          modalText.includes(record.CurrentAddress) &&
          modalText.includes(record.State) &&
          modalText.includes(record.City)
        ) {
          testResult = "Pass";
        }
      } catch (e) {
        testResult = "Fail";
      }

      // Update the record with the result
      records[idx].TestResult = testResult;

    //   await browser.close();
    });
  });

  // After all tests, write results to a new CSV
  test.afterAll(async () => {
    const output = stringify(records, { header: true });
    fs.writeFileSync('./data_with_results.csv', output);
  });
});


