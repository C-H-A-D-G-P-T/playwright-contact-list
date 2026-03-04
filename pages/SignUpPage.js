import { expect } from '@playwright/test'
import { prepareContactData } from '../utils/DataPrep.js'

export const signup = async (page) => {
    await page.goto('/');
    await page.waitForFunction(() => document.readyState === 'complete');
    await expect(page).toHaveTitle('Contact List App');
    await page.click('#signup');
    await expect(page.getByRole('heading', { name: 'Add User'})).toBeVisible({ timeout: 45000 });

    const data = prepareContactData()
    console.log(data);
    await page.locator('#firstName').fill(data.firstName);
    await page.locator('#lastName').fill(data.lastName);

    await page.locator('#email').fill(data.email);
    await page.locator('#password').fill(data.password);

    await page.click('#submit');
    await expect(page.getByRole('heading', { name: 'Contact List'})).toBeVisible({ timeout: 45000 });

    return {email: data.email, password: data.password}
}