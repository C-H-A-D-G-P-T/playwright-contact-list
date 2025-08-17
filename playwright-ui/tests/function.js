import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
const fs = require('fs').promises;

const randomEmail = () => {
    const today = new Date();
    
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const second = today.getSeconds();
    const formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hour}${minute}${second}`;
    const email = `t${formattedDate}@gmail.com`;
    return email;
}

const randomPassword = (length) => {
    const randomString = Math.random().toString(36).substring(2, 2 + length);
    return `TEST${randomString}`
}

const fakeBirthDateFormatted = (format = 'YYYY-MM-DD') => {
    const year = String(faker.number.int({ min: 1990, max: 2000}));
    const month = String(faker.number.int({ min: 1, max: 12})).padStart(2, "0");
    let day;
    if (month === '02') {
        day = String(faker.number.int({ min: 1, max: 28 })).padStart(2, "0");
    } else if (['04', '06', '09', '11'].includes(month)) {
        day = String(faker.number.int({ min: 1, max: 30 })).padStart(2, "0");
    } else {
        day = String(faker.number.int({ min: 1, max: 31 })).padStart(2, "0");
    }

    if (format === 'YYYY-DD-MM') {
        return `${year}-${month}-${day}`
    } else {
        return `${year}-${month}-${day}`
    }
}

const fakePhoneNumber = () => {
    const firstPart = faker.number.int({ min: 8, max: 9});
    let phoneNumber = `0${firstPart}`
    for (let i = 0; i < 8; i++) {
        phoneNumber += String(faker.number.int({ min: 0, max: 9 }));
    }
    return phoneNumber;
}

const prepareContactData = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const streetAddr1 = faker.location.streetAddress(false);
    const streetAddr2 = faker.location.streetAddress(false);
    const city = faker.location.city();
    const state = faker.location.state();
    const postalCode = faker.location.zipCode('#####');
    const country = faker.location.country();
    return {
        firstName: firstName,
        lastName: lastName,
        streetAddr1: streetAddr1,
        streetAddr2: streetAddr2,
        city: city,
        state: state,
        postalCode: postalCode,
        country: country
    };
}

export const signup = async (page) => {
    await page.goto('/');
    await page.waitForFunction(() => document.readyState === 'complete');
    await expect(page).toHaveTitle('Contact List App');
    await page.click('#signup');
    await expect(page.getByRole('heading', { name: 'Add User'})).toBeVisible();

    await page.locator('#firstName').fill(faker.person.firstName());
    await page.locator('#lastName').fill(faker.person.lastName());

    const email = randomEmail();
    const password = randomPassword(8);
    console.log(email);
    console.log(password);
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);

    await page.click('#submit');
    await expect(page.getByRole('heading', { name: 'Contact List'})).toBeVisible();

    return {email: email, password: password}
}

export const logout = async (page) => {
    await page.click('#logout');
    await expect(page).toHaveTitle('Contact List App');
}

export const login = async (page, email, password) => {
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.click('#submit')
}

export const addNewContacts = async (page, contactAmount=5) => {
    for (let i = 0; i < contactAmount; i++) {
        await expect(page.locator('#add-contact')).toBeVisible({ timeout: 20000 });
        await page.click('#add-contact');
        await page.locator('#firstName').fill((prepareContactData().firstName).substring(0, 20));
        await page.locator('#lastName').fill((prepareContactData().lastName).substring(0, 20));
        await page.locator('#birthdate').fill(fakeBirthDateFormatted());
        await page.locator('#email').fill(randomEmail());
        await page.locator('#phone').fill(fakePhoneNumber());
        await page.locator('#street1').fill(prepareContactData().streetAddr1);
        await page.locator('#street2').fill(prepareContactData().streetAddr2);
        await page.locator('#city').fill(prepareContactData().city);
        await page.locator('#stateProvince').fill(prepareContactData().state);
        await page.locator('#postalCode').fill(prepareContactData().postalCode);
        await page.locator('#country').fill((prepareContactData().country).substring(0, 40));
        await page.click('#submit');
        await expect(page.locator('.contactTableBodyRow').nth(0)).toBeVisible({ timeout: 20000 });
        await expect(page.locator('.contactTableBodyRow')).toHaveCount(i + 1, { timeout: 20000 });
    }
    return contactAmount
}

export const exportContactsAsJson = async (page, contactAmount) => {
    let listData = []
    for (let i = 0; i < contactAmount; i++) {
        const fullName = await page.locator(`//tr[@class="contactTableBodyRow"][${i + 1}]/td[2]`).textContent();
        const birthDate = await page.locator(`//tr[@class="contactTableBodyRow"][${i + 1}]/td[3]`).textContent();
        const email = await page.locator(`//tr[@class="contactTableBodyRow"][${i + 1}]/td[4]`).textContent();
        const phoneNumber = await page.locator(`//tr[@class="contactTableBodyRow"][${i + 1}]/td[5]`).textContent();
        const address = await page.locator(`//tr[@class="contactTableBodyRow"][${i + 1}]/td[6]`).textContent();
        const city = await page.locator(`//tr[@class="contactTableBodyRow"][${i + 1}]/td[7]`).textContent();
        const country = await page.locator(`//tr[@class="contactTableBodyRow"][${i + 1}]/td[8]`).textContent();
        const dictData = {
            Name: fullName,
            Birthdate: birthDate,
            Email: email,
            Address1: address,
            Address2: city,
            Country: country
        };
        console.log(dictData);
        listData.push(dictData);
    }
    console.log(listData);
    await fs.writeFile('contacts.json', JSON.stringify(listData, null, 4));
    console.log('Contacts saved to contacts.json');
}

export const deleteAllContacts = async (page) => {
    let elementCount = await page.locator('//tr[@class="contactTableBodyRow"]').count();
    while (elementCount != 0) {
        await page.click('//tr[@class="contactTableBodyRow"][1]');
        await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: 20000 });
        await page.click('#delete');
        await page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button').click();
        await expect(page.locator('#myTable')).toBeVisible({ timeout: 20000 });
        await expect(page.locator('//tr[@class="contactTableBodyRow"]')).toHaveCount(elementCount - 1, { timeout: 20000 });
        let elementCount = await page.locator('//tr[@class="contactTableBodyRow"]').count();
    }
}