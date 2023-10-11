// import { debugLogger } from "../../common/logger";
import { ZodError, ZodIssue, ZodIssueCode } from "zod";
import User, { UserAttributes, UserUpdateAttributes } from "./users.model";
import bcrypt from "bcrypt";


export async function findAll(): Promise<User[]> {
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
	// Additional checks
	let userExists: User | null = null;

	try {
		userExists = await User.findOne({ where: { email: userData.email } });
	} catch (error) {
		// console.log(error);
	}

	if (userExists !== null) {
		// console.log("Email already exists");
		const issue: ZodIssue = {
			message: "Email already exists",
			code: ZodIssueCode.custom,
			path: [],
		};

		throw new ZodError([issue]);
	}

	try {

		const passwordHash = await bcrypt.hash(userData.password, 10);

		userData.password = passwordHash;
		const user = await User.create(userData);
		return user.toJSON();
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create user");
	}
}

export async function findUserByEmail(email: string): Promise<User> {
	try {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			throw new Error();
		}
		return user;
	} catch (error) {
		// console.log(error);
		throw new Error("User not found");
	}
}

export async function findUserById(userId: string): Promise<User> {
	try {
		const user = await User.findByPk(userId);
		if (!user) {
			throw new Error();
		}
		return user;
	} catch (error) {
		throw new Error("User not found");
	}
}

export async function updateUser(
	userId: string,
	userData: Partial<User>
): Promise<Partial<User>> {
	// Retrieve the user
	const user = await findUserById(userId);

	if (!user) {
		throw new Error("User not found");
	}

	// Not allowed to update password here
	if (userData?.password) {
		throw new Error("Attempt to change password");
	}

	user.setAttributes(userData);

	// if (userData?.email) {
	// 	user.email = userData.email;
	// }
	// if (userData?.name) {
	// 	user.name = userData.name;
	// }

	try {
		await user.save();
		return user;
	} catch (error) {
		throw new Error("Failed to update user");
	}
}

export async function deleteUser(userId: string): Promise<void> {
	let user;

	try {
		user = await User.findByPk(userId);
		if (!user) {
			throw new Error();
		}
	} catch (error) {
		throw new Error("User not found");
	}

	try {
		await user?.destroy();
	} catch (error) {
		throw new Error("Failed to delete user");
	}
}
