import sequelize from "../../common/db";
import { Model, DataTypes } from "sequelize";
import zod from "zod";
import UserAccountStatus from "./account.status";
import AccountStatus from "./account.status";
import { Currency } from "../../interfaces/Currency";

const AccountAttr = zod.object({
	id: zod.string().uuid().optional(),
	userId: zod.string().uuid(),
	currencyId: zod.string().uuid(),
	amount: zod.number(),
	status: zod.nativeEnum(UserAccountStatus),
});

export const updateAccount = zod.object({
	id: zod.string().uuid().optional(),
	userId: zod.string().uuid(),
	currencyId: zod.string().uuid().optional(),
	amount: zod.number().optional(),
	status: zod.nativeEnum(UserAccountStatus).optional(),
});

export type updateAccount = zod.infer<typeof updateAccount>;

export type AccountAttr = zod.infer<typeof AccountAttr>;

class Account extends Model<AccountAttr, AccountAttr> implements AccountAttr {
	declare id: string;
	declare userId: string;
	declare currencyId: string;
	declare amount: number;
	declare status: AccountStatus;
	declare currency: Currency;
}

Account.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
		},
		currencyId: {
			type: DataTypes.STRING,
		},
		amount: {
			type: DataTypes.INTEGER,
		},
		status: {
			type: DataTypes.ENUM(...Object.values(UserAccountStatus)),
			defaultValue: UserAccountStatus.ACTIVE,
		},
	},
	{
		sequelize,
		paranoid: true,
		modelName: "Account",
	}
);

if (process.env.NODE_ENV !== "production") {
	Account.sync({ alter: true });
}

export default Account;
