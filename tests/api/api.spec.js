import { test, expect } from "@playwright/test";
import { UserService } from "../../api/UserService.js";
import { prepareContactData } from "../../utils/DataPrep.js";
import {
	email,
	password,
	firstName,
	lastName,
} from "../../temp/RegUserData.json";

const dataPrep = prepareContactData();
test("should sign up successfully", async ({ request }) => {
	const api = new UserService(request);
	const requestBody = {
		data: {
			firstName: dataPrep.firstName,
			lastName: dataPrep.lastName,
			email: dataPrep.email,
			password: dataPrep.password,
		},
	};
	const response = await api.signUp(requestBody);

	console.log("REQUEST", requestBody);
	console.log("RESPONSE", response.body);

	expect(response.body.user.firstName).toBe(dataPrep.firstName);
	expect(response.body.user.lastName).toBe(dataPrep.lastName);
	expect(response.body.user.email).toBe(dataPrep.email);
});

// test("should log in successfully", async ({ request }) => {
// 	const logIn = await request.post("/users/login", {
// 		data: {
// 			email: email,
// 			password: password,
// 		},
// 	});

// 	const response = await logIn.json();
// 	console.log(response);

// 	expect(logIn.ok()).toBeTruthy();
// 	expect(response.user.firstName).toBe(firstName);
// 	expect(response.user.lastName).toBe(lastName);
// 	expect(response.user.email).toBe(email);
// });

// test("should get user profile successfully", async ({ request }) => {
// 	const token = await getToken();
// 	const getProfile = await request.get("/users/me", {
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 		},
// 	});

// 	const response = await getProfile.json();
// 	console.log(response);

// 	expect(getProfile.ok).toBeTruthy();
// 	expect(response.firstName).toBe(firstName);
// 	expect(response.lastName).toBe(lastName);
// 	expect(response.email).toBe(email);
// });
