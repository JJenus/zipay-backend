import request from "supertest";
import app from "../../app";
import { HTTPStatusCode } from "../../common/HTTPStatusCode";

describe("APPLICATION SETTINGS", () => {
	describe("create settings", () => {
		it("should create and return settings", async () =>
			request(app)
				.post("/api/app-settings")
				.set("Accept", "application/json")
				.send({
					defaultLanguage: "en",
					defaultBaseCurrency: "USD",
				})
				.expect("Content-Type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("id");
				}));
	});
});
