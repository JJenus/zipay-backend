import Account, { updateAccount } from "./account.model";
import AccountStatus from "./account.status";

export const createAccount = async (
	userId: string,
	currencyId: string
): Promise<Account> => {
	try {
		const account = new Account({
			userId: userId,
			currencyId: currencyId,
			amount: 0,
			status: AccountStatus.ACTIVE,
		});

		const newAccount = await account.save();

		return newAccount;
	} catch (error) {
		console.log(error);
		throw new Error("Unable to create account");
	}
};

export const updateBalance = async (update: updateAccount) => {
	let account: Account | null;
	try {
		account = await Account.findOne({ where: { userId: update.userId } });
		if (account === null) throw new Error();
	} catch (error) {
		throw new Error("Unauthorized balance update");
	}

	try {
		if (!update.amount) throw new Error();
		const balance = account.amount + update.amount;

		account.setDataValue("amount", balance);
		await account.save();
	} catch (error) {
		throw new Error("Unable to update balance");
	}
};

export const updateCurrency = async (update: updateAccount) => {
	let account: Account | null;
	try {
		account = await Account.findOne({ where: { userId: update.userId } });
		if (account === null) throw new Error();
	} catch (error) {
		throw new Error("Unauthorized currency update");
	}

	try {
		if (!update.currencyId) {
			throw new Error();
		}

		account.setDataValue("currencyId", update.currencyId);
		await account.save();
	} catch (error) {
		throw new Error("Unable to update currency");
	}
};
