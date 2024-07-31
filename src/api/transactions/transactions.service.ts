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

function generateAlphaNum(length: number) {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		result += charset[randomIndex];
	}
	return result;
}

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

export const findTransactionByTId = async (
	id: string
): Promise<Transaction> => {
	let result = await Transaction.findOne({
		where: {
			transactionId: id,
		},
	});
	if (result === null) {
		throw new Error("Transaction not found");
	}
	return result;
};

export const createTransaction = async (
	transaction: TransactionAttr
): Promise<Transaction> => {
	try {
		transaction.transactionId = generateAlphaNum(15);
		console.log("Created ID");

		while (
			await Transaction.findOne({
				where: {
					transactionId: transaction.transactionId,
				},
			})
		) {
			transaction.transactionId = generateAlphaNum(15);
		}
		console.log("Created ID Perfected");
		const result = await Transaction.create(transaction);

		return result;
	} catch (error) {
		console.log(error);
		throw new Error("Unable to create transaction");
	}
};
