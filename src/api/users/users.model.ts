import sequelize from "../../common/db";
import { DataTypes, Model } from "sequelize";
import zod from "zod";

export const UserAttributes = zod.object({
	id: zod.string().uuid("Invalid user ID").optional(),
	name: zod.string(),
	email: zod.string().email(),
	password: zod.string().refine((value: string) => value.length > 4, {
		message: "password too short",
	}),
});
export type UserAttributes = zod.infer<typeof UserAttributes>;

export const UserUpdateAttributes = zod.object({
	id: zod.string().uuid("Invalid user ID").optional(),
	name: zod.string().optional(),
	email: zod.string().email().optional(),
	password: zod.string().optional(),
});
export type UserUpdateAttributes = zod.infer<typeof UserUpdateAttributes>;

class User
	extends Model<UserAttributes, UserAttributes>
	implements UserAttributes
{
	declare id: string;
	declare name: string;
	declare email: string;
	declare password: string;

	public toJSON(): Partial<UserAttributes> {
		const { password, ...values } = { ...this.get() };
		return values;
	}
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		paranoid: true,
		modelName: "User",
	}
);

User.sync();

export default User;
