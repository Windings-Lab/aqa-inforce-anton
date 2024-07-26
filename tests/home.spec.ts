import {expect, test} from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');
});

async function checkCategory(page: any, expectedCategory: string)
{
  const response = await page.waitForResponse(response =>
    response.url() === 'https://api.demoblaze.com/bycat' &&
    response.status() === 200 &&
    response.headers()["content-type"] === "application/json"
  );
  const pageData = await response.json();
  const category = pageData.Items[0].cat;
  expect(category).toBe(expectedCategory);
}

test('changing category', async ({ page }) =>
{
  await page.getByRole('link', { name: /Phones/i }).click()
  await checkCategory(page, 'phone')
  await page.getByRole('link', { name: /Laptops/i }).click();
  await checkCategory(page, 'notebook')
  await page.getByRole('link', { name: /Monitors/i }).click();
  await checkCategory(page, 'monitor')
});