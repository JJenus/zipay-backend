import { NextFunction, Request, Response } from "express";
import * as Transactions from "./transactions.service";
import Transaction, { TransactionAttr } from "./transactions.model";
import * as Beneficiaries from "../beneficiaries/beneficiaries.service";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import { TransactionStatus, TransactionTypes } from "./transactions";
import { findUserAccount } from "../accounts/account.service";
import Account from "../accounts/account.model";
import Beneficiary from "../beneficiaries/beneficiaries.model";
import * as Notifications from "../notifications/notifications.service";
import {
	NotificationStatus,
	NotificationType,
} from "../notifications/notifications";
import Notification from "../notifications/notifications.model";
import { findUserById } from "../users/users.service";

export const findUserTransactions = async (
	req: Request<ParamsWithId>,
	res: Response<TransactionAttr[]>,
	next: NextFunction
) => {
	try {
		const transactions = await Transactions.findUserTransactions(
			req.params.id
		);

		const trans: TransactionAttr[] = [];

		// console.log("Transactions: ", transactions)

		const beneficiaryQueries = transactions.map(async (transaction) => {
			// console.log(transaction.beneficiaryId);
			const tran: TransactionAttr = transaction.toJSON();

			if (transaction.beneficiaryId) {
				const beneficiary = await Beneficiaries.findBeneficiaryById(
					transaction.beneficiaryId
				);
				transaction.setAttributes("beneficiary", beneficiary);
				tran.beneficiary = beneficiary;
			}
			trans.push(tran);
		});

		await Promise.all(beneficiaryQueries);

		// console.log(transactions);

		res.json(trans);
	} catch (error) {
		if (error instanceof Error) {
			console.log("Find Error: ", error.message);
		}
		next(error);
	}
};

export const findTransactionByTId = async (
	req: Request<ParamsWithId>,
	res: Response<TransactionAttr>,
	next: NextFunction
) => {
	try {
		const transaction = await Transactions.findTransactionByTId(
			req.params.id
		);

		// console.log("Transactions: ", transactions)

		const tran: TransactionAttr = transaction.toJSON();

		if (transaction.beneficiaryId) {
			const beneficiary = await Beneficiaries.findBeneficiaryById(
				transaction.beneficiaryId
			);
			transaction.setDataValue("beneficiary", beneficiary);
			tran.beneficiary = beneficiary;
		}

		res.json(transaction);
	} catch (error) {
		if (error instanceof Error) {
			console.log("Find Error: ", error.message);
		}
		next(error);
	}
};

export const createTransaction = async (
	req: Request<{}, Transaction, TransactionAttr>,
	res: Response<Transaction>,
	next: NextFunction
) => {
	let transactionLog: Transaction | null = null;
	const transaction: TransactionAttr = req.body;

	try {
		if (!req.body.beneficiary) {
			res.status(422);
			throw new Error("Beneficiary is required");
		}

		// Save beneficiary and retrieve id
		const beneficiary: Beneficiary = await Beneficiaries.createBeneficiary(
			transaction.beneficiary!
		);
		transaction.beneficiaryId = beneficiary.id;

		transaction.status = TransactionStatus.PENDING;
		// save user transaction
		transactionLog = await Transactions.createTransaction(transaction);

		// Balance sender account
		const senderAccount: Account = await findUserAccount(
			transaction.senderId
		);

		if (senderAccount.amount < transaction.amount) {
			res.status(422);
			throw new Error("Insufficient balance");
		}
		const balance: number = senderAccount.amount - transaction.amount;
		senderAccount.setDataValue("amount", balance);

		// update sender account
		await senderAccount.save();

		// Balance receiver account

		if ((transaction.type = TransactionTypes.SEND)) {
			const receiverAccount: Account = await findUserAccount(
				transaction.beneficiary?.userId!
			);
			const balance: number = receiverAccount.amount + transaction.amount;
			receiverAccount.setAttributes("amount", balance);
			// update receiver account

			await receiverAccount.save();

			// notify receiver
			try {
				const sender = await findUserById(transaction.senderId);
				const notification: Notification =
					await Notifications.createNotification({
						title: "Credit alert",
						userId: receiverAccount.id,
						status: NotificationStatus.UNREAD,
						message: `Received ${transaction.amount} from ${sender.name}`,
						type: NotificationType.CREDIT,
					});
			} catch (error) {}
		}

		transactionLog.setDataValue("status", TransactionStatus.PROCESSING);
		// TODO: create notification websocket and pass this notification

		// notify sender: This shouldn't interrupt a successful transaction
		try {
			await transactionLog.save();
			const notification: Notification =
				await Notifications.createNotification({
					title: "Transfer Processing",
					userId: transaction.senderId,
					status: NotificationStatus.UNREAD,
					message: `${transaction.amount} processing`,
					type: NotificationType.DEBIT,
				});
		} catch (error) {}

		res.json(transactionLog);
	} catch (error) {
		try {
			if (transactionLog) {
				transactionLog.setDataValue("status", TransactionStatus.FAILED);
				await transactionLog.save();
			} else {
				transaction.status = TransactionStatus.FAILED;
				Transactions.createTransaction(transaction);
			}

			let message: string = "";
			if (
				error instanceof Error &&
				(error.message.includes("Beneficiary") ||
					error.message.includes("balance"))
			) {
				message = error.message;
			}
			const notification: Notification =
				await Notifications.createNotification({
					title: "Transaction error",
					userId: transaction.senderId,
					status: NotificationStatus.UNREAD,
					message: message,
					type: NotificationType.FAILED,
				});
		} catch (error) {}
		next(error);
	}
};

export const updateTransaction = async (
	req: Request<{}, Transaction, TransactionAttr>,
	res: Response<Transaction>,
	next: NextFunction
) => {
	let transactionLog: Transaction = await Transactions.findTransactionById(
		req.body.id!
	);

	if (!transactionLog) {
		throw new Error("Invalid transaction id");
	}

	// save user transaction
	transactionLog.setDataValue("status", req.body.status);
	transactionLog.setDataValue("notes", req.body.notes);
	// TODO: create notification websocket and pass this notification

	// notify sender: This shouldn't interrupt a successful transaction
	await transactionLog.save();

	const notification: Notification = await Notifications.createNotification({
		title:
			transactionLog.status === TransactionStatus.COMPLETED
				? "Transaction Successful"
				: "Transfer Processing",
		userId: transactionLog.senderId,
		status: NotificationStatus.UNREAD,
		message: `${transactionLog.amount} ${
			transactionLog.status === TransactionStatus.AWAITING
				? "Sent to bank"
				: transactionLog.status
		}`,
		type: NotificationType.DEBIT,
	});

	res.json(transactionLog);
};
