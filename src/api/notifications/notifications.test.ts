import request from "supertest";
import app from "../../app";
import { HTTPStatusCode } from "../../common/HTTPStatusCode";
import { NotificationAttr } from "./notifications.model";
import { NotificationStatus, NotificationType } from "./notifications";

describe("NOTIFICATIONS", () => {
	describe("GET /api/notifications/:id", () => {
		it("should return an array of notifications", async () =>
			request(app)
				.get("/api/notifications/ec84100d-32d0-4b90-b985-93aea5874116")
				.set("Accept", "application/json")
				.expect("Content-Type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("length");
				}));
	});

	describe("POST /api/notifications", () => {
		const notification: NotificationAttr = {
			userId: "ec84100d-32d0-4b90-b985-93aea5874116",
			status: NotificationStatus.UNREAD,
			type: NotificationType.ACCOUNT_UPDATE,
			message: "Message must not be empty",
		};
		it("should create notification", async () =>
			request(app)
				.post("/api/notifications")
				.set("Accept", "application/json")
				.send(notification)
				.expect("Content-Type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("id");
					expect(res.body.status).toBe(NotificationStatus.UNREAD);
				}));
	});
});

// Settings:
// Attributes: Setting ID, User ID, Preferences (Language, Notifications), etc.
// Relationships: One-to-one with Users.
