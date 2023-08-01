import sequelize from "../../common/db";
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

	public toJSON(): Partial<UserAttributes> {
		const values = { ...this.get() };
		delete values.password;
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

if(process.env.NODE_ENV !== "production"){
	User.sync({ force: true, alter: true })
} else {
	User.sync({ force: true, alter: true })
}


export default User;
