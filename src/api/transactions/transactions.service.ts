import Transaction, { TransactionAttr } from "./transactions.model";
import { Op } from "sequelize";

export const findUserTransactions = async (
	id: string
): Promise<Transaction[]> => {
	try {
		let result = await Transaction.findAll({
			where: {
				[Op.or]: [
					{
						senderId: id,
					},
					{
						receiverId: id,
					},
				],
			},
		});
		if (!result) {
			throw new Error("");
		}
		return result;
	} catch (error) {
		throw new Error("Unable to fetch transactions");
	}
};

export const findTransactionById = async (id: string): Promise<Transaction> => {
	try {
		let result = await Transaction.findByPk(id);
		if (!result) {
			throw new Error("");
		}
		return result;
	} catch (error) {
		throw new Error("Unable to fetch transaction");
	}
};

export const createTransaction = async (
	transaction: TransactionAttr
): Promise<Transaction> => {
	try {
		const result = await Transaction.create(transaction);

		return result;
	} catch (error) {
		throw new Error("Unable to create transaction");
	}
};
