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
import { ERROR } from "sqlite3";

export const findUserTransactions = async (
	req: Request<ParamsWithId>,
	res: Response<Transaction[]>,
	next: NextFunction
) => {
	try {
		const transactions = await Transactions.findUserTransactions(
			req.params.id
		);

		// console.log("Transactions: ", transactions)

		const beneficiaryQueries = transactions.map(async (transaction) => {
			console.log(transaction.beneficiaryId)
			transaction.beneficiary = await Beneficiaries.findBeneficiaryById(
				transaction.beneficiaryId
			);
		});

		await Promise.all(beneficiaryQueries);

		res.json(transactions);
	} catch (error) {
		if(error instanceof Error){
			console.log("Find Error: ", error.message)
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

		transaction.status = TransactionStatus.PENDING;
		// save user transaction
		transactionLog = await Transactions.createTransaction(transaction);

		// Balance sender account
		const senderAccount: Account = await findUserAccount(
			transaction.senderId
		);

		if (senderAccount.amount < transaction.amount) {
			res.status(422);
			const error = new Error("Insufficient balance");
		}
		const balance: number = senderAccount.amount - transaction.amount;
		senderAccount.setAttributes("amount", balance);

		// Save beneficiary and retrieve id
		const beneficiary: Beneficiary = await Beneficiaries.createBeneficiary(
			transaction.beneficiary!
		);
		transaction.beneficiaryId = beneficiary.id;

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
				const notification: Notification =
					await Notifications.createNotification({
						userId: receiverAccount.id,
						status: NotificationStatus.UNREAD,
						message: "",
						type: NotificationType.CREDIT,
					});
			} catch (error) {}
		}

		transactionLog.setAttributes("status", TransactionStatus.COMPLETED);
		// TODO: create notification websocket and pass this notification

		// notify sender: This shouldn't interrupt a successful transaction
		try {
			const notification: Notification =
				await Notifications.createNotification({
					userId: senderAccount.id,
					status: NotificationStatus.UNREAD,
					message: "",
					type: NotificationType.DEBIT,
				});
		} catch (error) {}

		res.json(transactionLog);
	} catch (error) {
		try {
			if (transactionLog) {
				transactionLog.setAttributes(
					"status",
					TransactionStatus.FAILED
				);
				transactionLog.save();
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
					userId: transaction.senderId,
					status: NotificationStatus.UNREAD,
					message: message,
					type: NotificationType.FAILED,
				});
		} catch (error) {}
		next(error);
	}
};
