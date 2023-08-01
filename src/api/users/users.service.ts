// import { debugLogger } from "../../common/logger";
import User, { UserAttributes } from "./users.model";
// import Joi from "joi";

// const userSchema = Joi.object({
// 	id: Joi.string().optional(),
// 	name: Joi.string().optional(),
// 	email: Joi.string().email().optional(),
// 	password: Joi.string().optional(),
// });

const safeUser = (user: User): Partial<User> => {
	const { password, ...userData } = user.toJSON();
	return userData;
};

export async function findAll(): Promise<User[] | null> {
	try {
		const users = await User.findAll();
		return users;
	} catch (error) {
		// console.log(error);
		console.log("Unable to find users");
		throw new Error("Unable to find users");
	}
}

export async function createUser(
	userData: UserAttributes
): Promise<Partial<User>> {
	// Input validation
	// const { error } = userSchema.validate(userData);

	// if (error) {
	// 	console.log("Validation Error: " + error.message);
	// 	throw new Error("Invalid user data");
	// }

	// Additional checks
	let userExists: User | null = null;

	try {
		userExists = await User.findOne({ where: { email: userData.email } });
	} catch (error) {
		// console.log(error);
	}

	if (userExists !== null) {
		// console.log("Email already exists");
		throw new Error("Email already exists");
	}

	try {
		const user = await User.create(userData);
		return safeUser(user);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create user");
	}
}

export async function findUserByEmail(
	email: string
): Promise<Partial<User> | null> {
	try {
		const user = await User.findOne({ where: { email } });
		return user;
	} catch (error) {
		// console.log(error);
		throw new Error("User not found");
	}
}

export async function findUserById(userId: string): Promise<User | null> {
	try {
		const user = await User.findByPk(userId);
		return user;
	} catch (error) {
		throw new Error("Failed to retrieve user");
	}
}

export async function updateUser(
	userId: string,
	userData: UserAttributes
): Promise<User> {
	// Input validation
	// const { error } = userSchema.validate(userData);

	// if (error) {
	// 	// throw new Error("Invalid user data");
	// 	console.log(error.message);
	// }

	// Retrieve the user
	const user = await findUserById(userId);

	if (!user) {
		throw new Error("User not found");
	}

	// Perform the update
	Object.assign(user, userData);

	try {
		await user.save();
		return user;
	} catch (error) {
		throw new Error("Failed to update user");
	}
}

export async function deleteUser(userId: string): Promise<void> {
	// try {
	// 	await User.destroy({where: {id: userId}})
	// } catch (error) {
	// 	throw new Error("Failed to delete user");
	// }

	let user;

	try {
		user = await findUserById(userId);
		if (!user) {
			throw new Error();
		}
	} catch (error) {
		throw new Error("No such user");
	}

	try {
		await user?.destroy();
	} catch (error) {
		throw new Error("Failed to delete user");
	}
}
