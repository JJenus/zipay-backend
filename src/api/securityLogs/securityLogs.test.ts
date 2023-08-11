import request from "supertest";
import app from "../../app";
import { HTTPStatusCode } from "../../common/HTTPStatusCode";
import { SecurityLogAttr } from "./securityLogs.model";
import { SecurityLogAction } from "./securityLogs";

describe("SECURITY LOGS: ", () => {
	describe("GET /api/security-logs/:id", () => {
		it("should return an array of security logs", async () =>
			request(app)
				.get("/api/security-logs/ec84100d-32d0-4b90-b985-93aea5874116")
				.set("Accept", "application/json")
				.expect("Content-Type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("length");
				}));
	});

	describe("POST /api/security-logs", () => {
		const log: SecurityLogAttr = {
			userId: "ec84100d-32d0-4b90-b985-93aea5874116",
			action: SecurityLogAction.LOGIN,
			ip: "127.0.0.1",
			reason: "Wrong password",
			deviceInfo: "Techno K7",
		};
		it("should create a security log", async () =>
			request(app)
				.post("/api/security-logs")
				.set("Accept", "application/json")
				.send(log)
				.expect("Content-Type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("id");
					expect(res.body.action).toBe(SecurityLogAction.LOGIN);
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
