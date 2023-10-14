import { DataTypes, Model } from "sequelize";
import zod from "zod";
import sequelize from "../../common/db";
import { NotificationStatus, NotificationType } from "./notifications";

export const NotificationAttr = zod.object({
	id: zod.string().uuid("invalid notification id").optional(),
	userId: zod.string().uuid("invalid user id"),
	title: zod.string(),
	status: zod.nativeEnum(NotificationStatus).optional(),
	message: zod.string().min(3),
	type: zod.nativeEnum(NotificationType).optional(),
});

export type NotificationAttr = zod.infer<typeof NotificationAttr>;

class Notification extends Model<NotificationAttr> implements NotificationAttr {
	declare id: string;
	declare userId: string;
	declare title: string;
	declare status: NotificationStatus;
	declare message: string;
	declare type: NotificationType;
}

Notification.init(
	{
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		userId: {
			type: DataTypes.STRING,
		},
		title: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.ENUM(...Object.values(NotificationStatus)),
			defaultValue: NotificationStatus.UNREAD,
		},
		message: {
			type: DataTypes.STRING,
		},
		type: {
			type: DataTypes.ENUM(...Object.values(NotificationType)),
			defaultValue: NotificationType.INFO,
		},
	},
	{
		sequelize,
		modelName: "Notification",
	}
);

if (process.env.NODE_ENV === "development") Notification.sync({ alter: true });
else Notification.sync();

export default Notification;
