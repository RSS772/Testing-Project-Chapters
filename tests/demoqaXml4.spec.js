import { test, chromium } from '@playwright/test';
import fs from 'fs';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

test('Demo - Multiple Users from XML', async () => {
  const xmlPath = './Data.xml';
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
  const parser = new XMLParser();
  const parsed = parser.parse(xmlContent);

  // Ensure users is always an array
  let users = parsed.Users.User;
  if (!Array.isArray(users)) users = [users];

  for (let i = 0; i < users.length; i++) {
    const myData = users[i];

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto("https://demoqa.com/text-box");

    await page.getByPlaceholder("Full Name").fill(myData.FullName);
    await page.getByPlaceholder("name@example.com").fill(myData.Email);
    await page.getByPlaceholder("Current Address").fill(myData.CurrentAddress);
    await page.locator("#permanentAddress").fill(myData.PermanentAddress);

    await page.getByRole('button', { name: 'Submit' }).click();

    const output = await page.locator("#output").textContent();

    const isPass =
      output.includes(myData.FullName) &&
      output.includes(myData.Email) &&
      output.includes(myData.CurrentAddress) &&
      output.includes(myData.PermanentAddress);

    // Update testResult for this user
    users[i].testResult = isPass ? 'Pass' : 'Fail';

    await browser.close();
  }

  // Write back all users with updated testResult
  const builder = new XMLBuilder({ format: true });
  const updatedXML = builder.build({ Users: { User: users } });
  fs.writeFileSync(xmlPath, updatedXML);
});