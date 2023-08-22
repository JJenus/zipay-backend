import { DataTypes, Model } from "sequelize";
import zod from "zod";
import sequelize from "../../common/db";

export const CurrencyAttr = zod.object({
	id: zod.string().uuid().optional(),
	country: zod.string().min(2),
	symbol: zod.string().min(3),
	code: zod.string().length(3),
});

export type CurrencyAttr = zod.infer<typeof CurrencyAttr>;

class Currency extends Model<CurrencyAttr> implements CurrencyAttr {
	declare id: string;
	declare country: string;
	declare symbol: string;
	declare code: string;
}

Currency.init(
	{
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		country: {
			type: DataTypes.STRING,
		},
		code: {
			type: DataTypes.STRING,
		},
		symbol: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		modelName: "Currency",
	}
);

Currency.sync({ alter: true });

export default Currency;
