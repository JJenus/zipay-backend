import { DataTypes, Model } from "sequelize";
import zod from "zod";
import sequelize from "../../common/db";
import { SecurityLogAction } from "./securityLogs";

export const SecurityLogAttr = zod.object({
	id: zod.string().uuid("invalid log id").optional(),
	userId: zod.string().uuid("invalid user id"),
	action: zod.nativeEnum(SecurityLogAction),
	ip: zod.string().min(3),
	deviceInfo: zod.string(),
	reason: zod.string(),
});

export type SecurityLogAttr = zod.infer<typeof SecurityLogAttr>;

class SecurityLog extends Model<SecurityLogAttr> implements SecurityLogAttr {
	declare id: string;
	declare userId: string;
	declare action: SecurityLogAction;
	declare ip: string;
	declare deviceInfo: string;
	declare reason: string
}

SecurityLog.init(
	{
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		userId: {
			type: DataTypes.STRING,
		},
		action: {
			type: DataTypes.ENUM(...Object.values(SecurityLogAction)),
		},
		ip: {
			type: DataTypes.STRING,
		},
		deviceInfo: {
			type: DataTypes.STRING,
		},
		reason: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		modelName: "SecurityLog",
	}
);

SecurityLog.sync({ alter: true });

export default SecurityLog;
