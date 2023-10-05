import request from "supertest";
import app from "../../app";
import { HTTPStatusCode } from "../../common/HTTPStatusCode";
import { TransactionAttr } from "./transactions.model";
import { TransactionTypes } from "./transactions";
import { BeneficiaryAttr } from "../beneficiaries/beneficiaries.model";

describe("TRANSACTIONS: ", () => {
	describe("GET /api/transactions/:id", () => {
		it("should return an array of user transactions", async () =>
			request(app)
				.get("/api/transactions/d3d2975a-f4c9-47e2-9a80-1bb1b55e103a")
				.set("Accept", "application/json")
				.expect("Content-Type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("length");
				}));
	});

	describe("POST /api/transactions", () => {
		const beneficiary: BeneficiaryAttr = {
			userId: "49d5ce8e-5273-44b9-b449-7a3ce278efb5",
			name: "Ikeme fula",
			destinationAccount: "kilade@efs.com",
			bank: "paypal",
		};
		const transaction: TransactionAttr = {
			senderId: "49d5ce8e-5273-44b9-b449-7a3ce278efb5",
			receiverId: "d3d2975a-f4c9-47e2-9a80-1bb1b55e103a",
			amount: 0,
			type: TransactionTypes.DEBIT,
			beneficiary: beneficiary,
		};
		it("should create a transaction", async () =>
			request(app)
				.post("/api/transactions")
				.set("Accept", "application/json")
				.send(transaction)
				.expect("Content-Type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					// console.log(res.body);
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
