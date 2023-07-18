import User, { UserAttributes } from "./users.model";
import Joi from "joi";

const userSchema = Joi.object({
	id: Joi.string().optional(),
	name: Joi.string().optional(),
	email: Joi.string().email().optional(),
	password: Joi.string().optional(),
});

export async function getAllUsers(): Promise<User[] | null> {
	const users = await User.findAll();
	return users;
}

export async function createUser(userData: UserAttributes): Promise<User> {
	// Input validation
	const { error } = userSchema.validate(userData);

	if (error) {
		console.log(error.message);
		// throw new Error("Invalid user data");
	}

	// Additional checks
	const emailExists = await findUserByEmail(userData.email!);
	if (emailExists) {
		throw new Error("Email already exists");
	}

	try {
		const user = await User.create(userData);
		return user;
	} catch (error) {
		throw new Error("Failed to create user");
	}
}

export async function findUserByEmail(email: string): Promise<User | null> {
	try {
		const user = await User.findOne({ where: { email } });
		return user;
	} catch (error) {
		throw new Error("Failed to find user by email");
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
	const { error } = userSchema.validate(userData);

	if (error) {
		// throw new Error("Invalid user data");
		console.log(error.message);
	}

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
	try {
		const user = await findUserById(userId);

		if (!user) {
			throw new Error("User not found");
		}

		await user.destroy();
	} catch (error) {
		throw new Error("Failed to delete user");
	}
}
