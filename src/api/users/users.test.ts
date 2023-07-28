import User from "./users.model";
import * as Users from "./users.service";

//important setup before test starts
let userId: string; // to be assigned an id on create and used to find one by id;
let userEmail: string = "tester@email.com"; // to be used to create and find one by email;

beforeAll(async () => {
	await User.drop();
});

//Testing individual functions without supertest

describe("USER SERVICE: find all users", () => {
	it("returns an array of users", async () => {
		const users = await Users.getAllUsers();

		expect(users).toBeInstanceOf(Array<User>);
		// expect(1).toBe(1);
	});
});

describe("USER SERVICE: create user", () => {
	it("creates a user and returns the user id", async () => {
		const user = await Users.createUser({
			email: userEmail,
			name: "Tester",
			password: "password",
		});

		expect(user).toBeInstanceOf(User);
		expect(user).toHaveProperty("id");

		console.log(user.id);

		userId = user.id!;
	});
});

describe("USER SERVICE: find user by email", () => {
	it("returns null for non-existing user", async () => {
		const user = await Users.findUserByEmail("fake@email.error");

		expect(user).toBe(null);
	});

	it("returns a user found with by the email", async () => {
		const user = await Users.findUserByEmail(userEmail);

		expect(user).toBeInstanceOf(User);
		expect(user).toHaveProperty("email");
		expect(user!.id).toBe(userId);
		// console.log(user!.toJSON());
	});
});

describe("USER SERVICE: find user by id", () => {
	it("returns null on a non-existing id", async () => {
		// On supertest, joi middleware will be used to validate incorrect
		// id, provent hitting the db
		const user = await Users.findUserById("1191");

		expect(user).toBe(null);
	});

	it("returns a user with the id", async () => {
		const user = await Users.findUserById(userId);

		expect(user).toBeInstanceOf(User);
		expect(user!.email).toBe(userEmail); //previously added email with searched id (check to confirm data integrity)
		// console.log(user!.toJSON());
	});
});

describe("USER SERVICE: update user", () => {
	it("returns the updated user with new name", async () => {
		const updateName = "alice";
		const user = await Users.updateUser(userId, { name: updateName });

		expect(user.name).toBe(updateName);
	});

	it("returns the updated user with new email ", async () => {
		const updateEmail = "alice@statsset.com";
		const user = await Users.updateUser(userId, { email: updateEmail });

		expect(user.email).toBe(updateEmail);
		// console.log(user.toJSON());
	});
});

describe("USER SERVICE: delete user", () => {
	it("deletes a user with the given id", async () => {
		await expect(Users.deleteUser(userId)).resolves.not.toThrow();
	});
});

//Testing testing the flow with jest
