import {expect, test} from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');
});

async function postCategory(page: any, category: string)
{
  const pageData = await page.evaluate(async (cat: string) =>
  {
    const payload = { cat };
    const response = await fetch('https://api.demoblaze.com/bycat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  }, category);
  const responseCategory = pageData.Items[0].cat;
  expect(responseCategory).toBe(category);
}

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
  await postCategory(page, 'phone')
  await postCategory(page, 'notebook')
  await postCategory(page, 'monitor')
  await page.getByRole('link', { name: /Phones/i }).click()
  await checkCategory(page, 'phone')
  await page.getByRole('link', { name: /Laptops/i }).click();
  await checkCategory(page, 'notebook')
  await page.getByRole('link', { name: /Monitors/i }).click();
  await checkCategory(page, 'monitor')
});