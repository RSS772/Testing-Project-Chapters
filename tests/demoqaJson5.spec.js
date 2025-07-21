// @ts-check
import { test, expect, chromium } from '@playwright/test';
import fs from 'fs';
//import myData from '../Data.json'
const myData = JSON.parse(JSON.stringify(require("../Data.json")))

test("Demo", async () => {
   const browser = await chromium.launch();
   const page = await browser.newPage();
   await page.goto("https://demoqa.com/text-box");

   //filling the full name from the json file
   await page.getByPlaceholder("Full Name").click();
   await page.locator("//input[@id='userName']").pressSequentially(myData.FullName);
   
   //filling the email from the json file
   await page.getByPlaceholder("name@example.com").click();
   await page.locator('//input[@type="email"]').fill(myData.Email);
   
   //filling the current address from the json file
   await page.getByPlaceholder("Current Address").click();
   await page.locator("//textarea[@id='currentAddress']").fill(myData.CurrentAddress);
   
   //filling the permanentAddress from json file
   await page.locator("//textarea[@id='permanentAddress']").click();
   await page.locator("//textarea[@id='permanentAddress']").fill(myData.PermanentAddress);
   
   //submit the details
   await page.locator("//button[@id='submit']").click();
   
   //checking whether the inputs are correct
   const output = await page.locator("//div[@id='output']").textContent();
   console.log(output);
   await expect(page.locator("//div[@id='output']")).toBeVisible();

   //passing the value pass or fail in json
   let result = 'fail'
   try {
      await expect(page.locator("//div[@id='output']")).toBeVisible();
      result = 'pass'
   }
   catch (error) {
      result = 'fail';
   }

   /// Writing the result to the JSON file
   myData.TestResult = result;
   fs.writeFileSync('./Data.json', JSON.stringify(myData, null, 2));

   console.log('TestResult:', myData.TestResult);
   await browser.close();

   //await page.pause();                  

})