// users.service.test.ts
import * as Users from "./users.service";
import User, { UserAttributes } from "./users.model";
import sequelize from "../../common/db";

const testEmail = "lorem@example.com";

function pauseExecution() {
	console.log("Start");
	const startTime = Date.now();
	while (Date.now() - startTime < 2000) {
		// Blocking loop for 2 seconds
	}
	console.log("Delayed Execution");
}

pauseExecution();

describe("USER SERVICE", () => {
	afterAll(async () => {
		try {
			await User.destroy({ where: {} });
			await sequelize.close();
		} catch (error) {
			//or it didn't
		}
	});

	describe("createUser", () => {
		it("creates a user and returns the user with id", async () => {
			// console.log("User: 1");
			// Mock the user creation data
			const userData: UserAttributes = {
				name: "Lorem Ipsum",
				email: testEmail,
				password: "password",
			};

			// Call the createUser function
			const result = await Users.createUser(userData);

			// Expect that the result contains the created user's data
			expect(result).toHaveProperty("id");
		});

		it("throws an error when user email already exists", async () => {
			// console.log("User: 2");
			// Mock the invalid user creation data
			const userData: UserAttributes = {
				name: "Invalid User",
				email: testEmail,
				password: "password",
			};

			// Call the createUser function and expect it to throw an error
			await expect(Users.createUser(userData)).rejects.toThrowError();
		});
	});

	describe("findUserByEmail", () => {
		it("returns a user when email exists", async () => {
			// console.log("Email: 1");
			let user = await Users.findUserByEmail(testEmail);
			if (!user) {
				user = await Users.createUser({
					name: "John Doe",
					email: testEmail,
					password: "password",
				});
			}

			// Mock the email to find
			const emailToFind = user.email!;

			// Call the findUserByEmail function
			const result = await Users.findUserByEmail(emailToFind);

			// Expect that the result contains the user's data
			expect(result).toEqual(
				expect.objectContaining({ email: emailToFind })
			);
		});

		it("returns null when email does not exist", async () => {
			// console.log("Email: 2");

			// Mock the non-existing email
			const nonExistingEmail = "nonexisting@example.com";

			// Call the findUserByEmail function
			const result = await Users.findUserByEmail(nonExistingEmail);

			// Expect that the result is null
			expect(result).toBeNull();
		});
	});

	describe("findUserById", () => {
		it("returns a user when ID exists", async () => {
			// Mock the User.findByPk method
			let user = await Users.findUserByEmail(testEmail);
			if (!user) {
				user = await Users.createUser({
					name: "John Doe",
					email: testEmail,
					password: "password",
				});
			}

			const userIdToFind = user.id!;

			// Call the findUserById function
			const result = await Users.findUserById(userIdToFind);

			// Expect that the result contains the user's data
			expect(result).toEqual(
				expect.objectContaining({ id: userIdToFind })
			);
		});

		it("returns null when ID does not exist", async () => {
			// Mock the non-existing user ID
			const nonExistingUserId = "nonexisting_id";

			// Call the findUserById function
			const result = await Users.findUserById(nonExistingUserId);

			// Expect that the result is null
			expect(result).toBeNull();
		});
	});

	describe("updateUser", () => {
		it("returns the updated user with new name", async () => {
			// Mock the user ID and updated data
			let user = await Users.findUserByEmail(testEmail);
			if (!user) {
				user = await Users.createUser({
					name: "John Doe",
					email: testEmail,
					password: "password",
				});
			}

			const userIdToUpdate = user.id!;
			const updatedData: UserAttributes = { name: "Updated Name" };

			// Call the updateUser function
			const result = await Users.updateUser(userIdToUpdate, updatedData);

			// Expect that the user's name was updated with the new name
			expect(result.name).toBe(updatedData.name);

			// Expect that the result contains the updated user's data
			expect(result).toEqual(expect.objectContaining(updatedData));
		});

		it("throws an error when user ID does not exist", async () => {
			// Mock the non-existing user ID and updated data
			const nonExistingUserId = "nonexisting_id";
			const updatedData: UserAttributes = { name: "Updated Name" };

			await expect(
				Users.updateUser(nonExistingUserId, updatedData)
			).rejects.toThrowError("User not found");
		});
	});

	describe("deleteUser", () => {
		it("deletes a user with the given ID", async () => {
			// Mock the user ID to delete
			let user = await Users.findUserByEmail(testEmail);
			if (!user) {
				user = await Users.createUser({
					name: "John Doe",
					email: testEmail,
					password: "password",
				});
			}

			const userIdToDelete = user.id!;

			// Call the deleteUser function
			await expect(
				Users.deleteUser(userIdToDelete)
			).resolves.not.toThrow();
		});

		it("throws an error when user ID does not exist", async () => {
			// Mock the non-existing user ID to delete
			const nonExistingUserId = "nonexisting_id";

			// Call the deleteUser function and expect it to throw an error
			await expect(
				Users.deleteUser(nonExistingUserId)
			).rejects.toThrowError("No such user");
		});
	});
});
