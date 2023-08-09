import Account from "./account.model";
import * as Accounts from "./account.service";
import AccountStatus from "./account.status";

describe("ACCOUNTS", () => {
	describe("create Account", () => {
		it("should create and return an account", async () => {
			const userId: string = "d3d2975a-f4c9-47e2-9a80-1bb1b55e103a";
			const currencyId = "d3d2975a-f4c9-47e2-9a80-1bb1b55e10id";

			const account: Account = await Accounts.createAccount(
				userId,
				currencyId
			);

			expect(account).toHaveProperty("currencyId");
			expect(account.amount).toBe(0);
			expect(account.status).toBe(AccountStatus.ACTIVE);
		});
	});

	describe("update balance", () => {
		it("should update account ", async () => {
			const userId: string = "d3d2975a-f4c9-47e2-9a80-1bb1b55e103a";

			await expect(
				Accounts.updateBalance({ userId, amount: 2000 })
			).resolves.not.toThrowError();
		});

		it("should throw an error on non-existing userId", async () => {
			const userId: string = "d3d2975a-f4c9-47e2-9a80-1bb1b55e1ttt";

			await expect(
				Accounts.updateBalance({ userId, amount: 2000 })
			).rejects.toThrowError();
		});
	});

	describe("update currency", () => {
		it("should update account ", async () => {
			const userId: string = "d3d2975a-f4c9-47e2-9a80-1bb1b55e103a";

			await expect(
				Accounts.updateCurrency({
					userId,
					currencyId: "d3d2975a-f4c9-47e2-9a80-1bb1b55e103a",
				})
			).resolves.not.toThrowError();
		});

		it("should throw an error on non-existing userId", async () => {
			const userId: string = "d3d2975a-f4c9-47e2-9a80-1bb1b55e1ttt";

			await expect(
				Accounts.updateCurrency({
					userId,
					currencyId: "d3d2975a-f4c9-47e2-9a80-1bb1b55e103a",
				})
			).rejects.toThrowError();
		});
	});
});
