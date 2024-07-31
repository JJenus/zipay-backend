import { DataTypes, Model } from "sequelize";
import zod from "zod";
import sequelize from "../../common/db";
import { TransactionStatus, TransactionTypes } from "./transactions";
import { BeneficiaryAttr } from "../beneficiaries/beneficiaries.model";

/**
 * Note all transaction types can be only be made by the user
 * The type is only reflected on beneficiary as notification
 */

export const TransactionAttr = zod.object({
	id: zod.string().uuid("invalid transaction id").optional(),
	senderId: zod.string().uuid("invalid sender id"),
	receiverId: zod.string().uuid("invalid receiver id").optional(),
	beneficiaryId: zod.string().uuid("invalid beneficiary id").optional(),
	amount: zod.number(),
	status: zod.nativeEnum(TransactionStatus).optional(),
	type: zod.nativeEnum(TransactionTypes),
	notes: zod.string().optional(),
	transactionId: zod.string().optional(),
	beneficiary: BeneficiaryAttr.optional(),
});

export type TransactionAttr = zod.infer<typeof TransactionAttr>;

class Transaction extends Model<TransactionAttr> implements TransactionAttr {
	declare id: string;
	declare senderId: string;
	declare receiverId: string;
	declare beneficiaryId: string;
	declare transactionId: string;
	declare amount: number;
	declare status: TransactionStatus;
	declare type: TransactionTypes;
	declare notes: string;
	declare beneficiary: BeneficiaryAttr;

	// public toJSON(): Partial<UserAttributes> {
	// 	const { password, ...values } = { ...this.get() };
	// 	return values;
	// }
}

Transaction.init(
	{
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		senderId: {
			type: DataTypes.STRING,
		},
		receiverId: {
			type: DataTypes.STRING,
		},
		transactionId: {
			type: DataTypes.STRING,
			defaultValue: "hidden",
		},
		beneficiaryId: {
			type: DataTypes.STRING,
		},
		amount: {
			type: DataTypes.INTEGER,
		},
		status: {
			type: DataTypes.ENUM(...Object.values(TransactionStatus)),
		},
		type: {
			type: DataTypes.ENUM(...Object.values(TransactionTypes)),
		},
		notes: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		modelName: "Transaction",
	}
);

Transaction.sync({ alter: true });

export default Transaction;
