// @ts-check
import { test } from '@playwright/test';
import { signup, logout, login, addNewContacts, exportContactsAsJson, deleteAllContacts } from './function.js';

test('Sign up successfully', async ({ page }) => {
    const { email, password } = await signup(page);
    await logout(page);
    await login(page, email, password);
    const contactAmount = await addNewContacts(page, 3);
    await exportContactsAsJson(page, contactAmount);
    await deleteAllContacts(page);
})
