import { test, expect } from "@playwright/test";
import { prepareContactData } from "../../utils/DataPrep.js";

const dataPrep = prepareContactData();
let token;

test.beforeAll("get token first", async ({ request }) => {
	const getToken = await request.post("/users/login", {
		data: {
			email: process.env.API_EMAIL,
			password: process.env.API_PASSWORD,
		},
	});
	expect(getToken.ok()).toBeTruthy();
	const response = await getToken.json();
	token = response.token;
});

test("should sign up successfully", async ({ request }) => {
	const signUp = await request.post("/userss", {
		data: {
			firstName: dataPrep.firstName,
			lastName: dataPrep.lastName,
			email: dataPrep.email,
			password: dataPrep.password,
		},
	});

	const response = await signUp.json();
	console.log(response);

	expect(signUp.ok()).toBeTruthy();
	expect(response.user.firstName).toBe(dataPrep.firstName);
	expect(response.user.lastName).toBe(dataPrep.lastName);
	expect(response.user.email).toBe(dataPrep.email);
});

test("should log in successfully", async ({ request }) => {
	const logIn = await request.post("/users/login", {
		data: {
			email: process.env.API_EMAIL,
			password: process.env.API_PASSWORD,
		},
	});

	const response = await logIn.json();
	console.log(response);

	expect(logIn.ok()).toBeTruthy();
	expect(response.user.firstName).toBe(process.env.API_FIRSTNAME);
	expect(response.user.lastName).toBe(process.env.API_LASTNAME);
	expect(response.user.email).toBe(process.env.API_EMAIL);
});

test("should get user profile successfully", async ({ request }) => {
	const getProfile = await request.get("/users/me", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const response = await getProfile.json();
	console.log(response);

	expect(getProfile.ok).toBeTruthy();
	expect(response.firstName).toBe(process.env.API_FIRSTNAME);
	expect(response.lastName).toBe(process.env.API_LASTNAME);
	expect(response.email).toBe(process.env.API_EMAIL);
});
