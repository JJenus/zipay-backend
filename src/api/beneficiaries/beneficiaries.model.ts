import { DataTypes, Model } from "sequelize";
import zod from "zod";
import sequelize from "../../common/db";

export const BeneficiaryAttr = zod.object({
	id: zod.string().uuid("invalid beneficiary id").optional(),
	userId: zod.string().uuid("invalid user id").optional(),
	name: zod.string(),
	destinationAccount: zod
		.string()
		.email()
		.or(zod.string().uuid())
		.or(zod.string().min(3)),
	bank: zod.string().min(3),
});

export type BeneficiaryAttr = zod.infer<typeof BeneficiaryAttr>;

class Beneficiary extends Model<BeneficiaryAttr> implements BeneficiaryAttr {
	declare id: string;
	declare userId: string;
	declare name: string;
	declare destinationAccount: string;
	declare bank: string;
}

Beneficiary.init(
	{
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		userId: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true
		},
		name: {
			type: DataTypes.STRING,
		},
		destinationAccount: {
			type: DataTypes.STRING,
		},
		bank: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		modelName: "Beneficiary",
	}
);

Beneficiary.sync({ alter: true });

export default Beneficiary;
