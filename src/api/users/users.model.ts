import sequelize from "../db";
import { DataTypes, Model, Optional } from "sequelize";

export interface UserAttributes {
	id?: string;
	name?: string;
	email?: string;
	password?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes
{
	declare id: string;
	declare name: string;
	declare email: string;
	declare password: string;
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
			unique: true,
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

User.sync({ force: true, alter: true });

export default User;
