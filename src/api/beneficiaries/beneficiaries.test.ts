import request from "supertest";
import app from "../../app";
import { HTTPStatusCode } from "../../common/HTTPStatusCode";
import { BeneficiaryAttr } from "./beneficiaries.model";

describe("BENEFICIARIES: ", () => {
	describe("GET /api/beneficiaries/:id", () => {
		it("should return an array of security logs", async () =>
			request(app)
				.get("/api/beneficiaries/ec84100d-32d0-4b90-b985-93aea5874116")
				.set("Accept", "application/json")
				.expect("Content-Type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("length");
				}));
	});

	describe("POST /api/beneficiaries", () => {
		const log: BeneficiaryAttr = {
			userId: "ec84100d-32d0-4b90-b985-93aea5874116",
			name: "Alager",
			bank: "Paypal",
			destinationAccount: "9044816452",
		};
		it("should create a security log", async () =>
			request(app)
				.post("/api/beneficiaries")
				.set("Accept", "application/json")
				.send(log)
				.expect("Content-Type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("id");
				}));
	});
});

// Attributes: Notification ID, User ID (recipient), Message, Timestamp, Status (Read/Unread), Type (Transaction, Account Update, etc.), etc.
// Relationships: Many-to-one with Users.

// Security Logs:
// Attributes: Log ID, User ID, Timestamp, Action (Login, Logout, Failed Attempt), IP Address, Device Info, etc.
// Relationships: Many-to-one with Users.

// Settings:
// Attributes: Setting ID, User ID, Preferences (Language, Notifications), etc.
// Relationships: One-to-one with Users.
