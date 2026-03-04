import { expect } from '@playwright/test'
import { prepareContactData } from '../utils/DataPrep.js'

export const addNewContacts = async (page, contactAmount=5) => {
    for (let i = 0; i < contactAmount; i++) {
        await expect(page.locator('#add-contact')).toBeVisible({ timeout: 15000 });
        await page.click('#add-contact');
        const data = prepareContactData()
        await page.locator('#firstName').fill((data.firstName).substring(0, 20));
        await page.locator('#lastName').fill((data.lastName).substring(0, 20));
        await page.locator('#birthdate').fill(data.dateOfBirth);
        await page.locator('#email').fill(data.email);
        await page.locator('#phone').fill(data.phone);
        await page.locator('#street1').fill(data.streetAddr1);
        await page.locator('#street2').fill(data.streetAddr2);
        await page.locator('#city').fill(data.city);
        await page.locator('#stateProvince').fill(data.state);
        await page.locator('#postalCode').fill(data.postalCode);
        await page.locator('#country').fill((data.country).substring(0, 40));
        await page.click('#submit');
        await expect(page.locator('.contactTableBodyRow').nth(0)).toBeVisible({ timeout: 15000 });
        await expect(page.locator('.contactTableBodyRow')).toHaveCount(i + 1, );
    }
    return contactAmount
}