import { expect } from '@playwright/test'

export const deleteAllContacts = async (page) => {
    let elementCount = await page.locator('//tr[@class="contactTableBodyRow"]').count();
    while (elementCount !== 0) {
        await page.click('//tr[@class="contactTableBodyRow"][1]');
        await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: 15000 });
        page.once('dialog', async (dialog) => {
            console.log(dialog.type());
            console.log(dialog.message());
            await dialog.accept();
        });
        await page.click('#delete');
        await page.goto('/contactList')
        await expect(page.locator('//tr[@class="contactTableBodyRow"]')).toHaveCount(elementCount - 1, );
        elementCount = await page.locator('//tr[@class="contactTableBodyRow"]').count();
        elementCount > 0 ? console.log(`${elementCount} contact(s) remaining`) : console.log(`All contacts have been deleted`)
    }
}