const { test, expect } = require('@playwright/test');
const XLSX = require('xlsx');
const path = require('path');

// npx playwright test tests/formTestNoPOM.spec.js

// Load Excel data
const filePath = path.resolve(__dirname, '../data/input.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const testData = XLSX.utils.sheet_to_json(sheet);

// Helper to write test result
function writeTestResult(rowIndex, result) {
  const cellAddress = `E${rowIndex + 2}`; // Assuming header is in row 1
  sheet[cellAddress] = { t: 's', v: result };
  XLSX.writeFile(workbook, filePath);
}

test.describe('xls', () => {
  testData.forEach((data, index) => {
    test(`Form test for row ${index + 2}`, async ({ page }) => {
      await page.goto('https://demoqa.com/text-box');

      await page.fill('#userName', data.FullName);
      await page.fill('#userEmail', data.Email);
      await page.fill('#currentAddress', data.CurrentAddress);
      await page.fill('#permanentAddress', data.PermanentAddress);
      await page.click('#submit');

      const name = await page.textContent('#name');
      const email = await page.textContent('#email');
      const current = await page.textContent('p#currentAddress');
      const permanent = await page.textContent('p#permanentAddress');

      console.log('Expected:', data);
      console.log('Actual:', { name, email, current, permanent });
        
    //   const result =
    //     name.includes(data.FullName) &&
    //     email.includes(data.Email) &&
    //     current.includes(data.CurrentAddress) &&
    //     permanent.includes(data.PermanentAddress);
      const result =
        name.trim() === `Name:${data.FullName}`.trim() &&
        email.trim() === `Email:${data.Email}`.trim() &&
        current.trim() === `Current Address :${data.CurrentAddress}`.trim() &&
        permanent.trim() === `Permananet Address :${data.PermanentAddress}`.trim();


        writeTestResult(index, result ? 'Pass' : 'Fail');
        expect(result).toBeTruthy();
        console.log(result);
        await page.pause();



    });
  });
});
