import { BaseService } from "./BaseService";

export class UserService extends BaseService {
	async login(body) {
		const response = await this.request.post(
			`${this.thinkingUrl}/users/login`,
			body,
		);
		return {
			status: response.status(),
			ok: response.ok(),
			body: await response.json(), // รวมร่างไปเลย
		};
	}

	async signUp(body) {
		const response = await this.request.post(`${this.thinkingUrl}/users`, body);
		return {
			status: response.status(),
			ok: response.ok(),
			body: await response.json(), // รวมร่างไปเลย
		};
	}

	async getProfile() {
		const response = await this.request.get(`${this.thinkingUrl}/users/me`);
		return {
			status: response.status(),
			ok: response.ok(),
			body: await response.json(), // รวมร่างไปเลย
		};
	}
}
