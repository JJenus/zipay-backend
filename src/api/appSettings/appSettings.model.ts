import { DataTypes, Model } from "sequelize";
import zod from "zod";
import sequelize from "../../common/db";

export const appSettings = zod.object({
	id: zod.string().uuid().optional(),
	defaultLanguage: zod.string().min(2),
	defaultBaseCurrency: zod.string().min(3),
});

export type appSettings = zod.infer<typeof appSettings>;

class AppSettings extends Model<appSettings> implements appSettings {
	declare id: string;
	declare defaultLanguage: string;
	declare defaultBaseCurrency: string;
}

AppSettings.init(
	{
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		defaultLanguage: {
			type: DataTypes.STRING,
		},
		defaultBaseCurrency: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		modelName: "AppSetting",
	}
);

AppSettings.sync({ alter: true });

export default AppSettings;
