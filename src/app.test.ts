import { HTTPStatusCode } from "./common/HTTPStatusCode";
import app from "./app";
import request from "supertest";

describe("app", () => {
	it("responds with not found message", (done) => {
		request(app)
			.get("/a-none-existing-route")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(HTTPStatusCode.NOT_FOUND, done);
	});
});

describe("GET /", () => {
	it("responds with a json message", async () =>
		request(app)
			.get("/")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(HTTPStatusCode.OK)
			.then((res) => {
				expect(res.body).toHaveProperty("message");
				expect(res.body.message).toBe("Welcome to zipay api");
			}));
});
