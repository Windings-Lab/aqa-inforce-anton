import {expect, test} from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');
});

test('changing category', async ({ page, context }) => {
    const cookies = await context.cookies()
    const cookie = cookies[0].value
    const pageData = await page.evaluate(async (cookie: string) =>
    {
        const prod_id = 1
        const flag = false
        const payload =
            {
                cookie,
                prod_id,
                flag
            };
        const response = await fetch('https://api.demoblaze.com/addtocart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        return await response.json();
    }, cookie);
});