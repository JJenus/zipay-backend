import sequelize from "../../common/db";
import { DataTypes, Model } from "sequelize";
import zod from "zod";
import { AccountAttr } from "../accounts/account.model";

export const UserAttributes = zod.object({
	id: zod.string().uuid("Invalid user ID").optional(),
	name: zod.string(),
	email: zod.string().email(),
	password: zod.string().refine((value: string) => value.length > 4, {
		message: "password too short",
	}),
	phone: zod.string(),
	imgUrl: zod.string().optional(),
	address: zod.string(),
	city: zod.string(),
	country: zod.string(),
	dob: zod.date().optional(),
	verified: zod.boolean().optional(),
	emailVerified: zod.boolean().optional(),
	userType: zod.string().optional(),
});
export type UserAttributes = zod.infer<typeof UserAttributes>;

export const UserUpdateAttributes = zod.object({
	id: zod.string().uuid("Invalid user ID").optional(),
	name: zod.string().optional(),
	email: zod.string().email().optional(),
	password: zod.string().optional(),
	phone: zod.string().optional(),
	imgUrl: zod.string().optional(),
	address: zod.string().optional(),
	city: zod.string().optional(),
	country: zod.string().optional(),
	dob: zod.date().optional(),
	verified: zod.boolean().optional(),
	emailVerified: zod.boolean().optional(),
	userType: zod.string().optional(),
	account: AccountAttr.optional()
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
	declare phone: string;
	declare imgUrl: string;
	declare address: string;
	declare city: string;
	declare country: string;
	declare dob: Date;
	declare verified: boolean;
	declare emailVerified: boolean;
	declare userType: string;

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
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		imgUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		country: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		dob: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		emailVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		userType: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "user",
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
