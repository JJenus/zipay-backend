// users.service.test.ts
import request from "supertest";
import * as Users from "./users.service";
import User, { UserAttributes, UserUpdateAttributes } from "./users.model";
import app from "../../app";
import { HTTPStatusCode } from "../../common/HTTPStatusCode";

const testEmail = "lorem@example.com";
const prefix = "1";
var id = "d3d2975a-f4c9-47e2-9a80-1bb1b55e103a";

afterAll(async () => {
	try {
		await User.destroy({
			where: {
				id: testEmail,
			},
		});
		await User.destroy({
			where: {
				id: prefix + testEmail,
			},
		});
		// await sequelize.close();
	} catch (error) {
		//or it didn't
	}
});

describe("USER SERVICE", () => {
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
			id = result.id!;
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

		it("throws error when email does not exist", async () => {
			// console.log("Email: 2");

			// Mock the non-existing email
			const nonExistingEmail = "nonexisting@example.com";

			// Call the findUserByEmail function
			await expect(
				Users.findUserByEmail(nonExistingEmail)
			).rejects.toThrowError();
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

		it("throws an error when ID does not exist", async () => {
			// Mock the non-existing user ID
			const nonExistingUserId = "nonexisting_id";

			// Expect that the result throws error
			await expect(
				Users.findUserById(nonExistingUserId)
			).rejects.toThrowError();
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
			const updatedData: Partial<User> = { name: "Updated Name" };

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
			const updatedData: Partial<User> = { name: "Updated Name" };

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
			).rejects.toThrowError("User not found");
		});
	});
});

describe("USER ROUTER", () => {
	describe("GET /users", () => {
		it("returns an array of users", async () =>
			request(app)
				.get("/api/users")
				.set("Accept", "application/json")
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("length");
				}));
	});

	describe("POST /users", () => {
		it("should create and return a user with id", async () => {
			return request(app)
				.post("/api/users")
				.set("Accept", "application/json")
				.send({
					name: "Lorem Ipsum",
					email: prefix + testEmail,
					password: "password",
				})
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					// console.log(res.body);
					expect(res.body).toHaveProperty("id");
				});
		});

		it("should respond with an error if user is invalid", async () =>
			request(app)
				.post("/api/users")
				.set("Accept", "application/json")
				.send({ content: "" })
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.VALIDATION_ERROR)
				.then((res) => {
					expect(res.body).toHaveProperty("message");
				}));
	});

	describe(`GET /users/:id`, () => {
		it(`returns a of user with id`, async () => {
			let user: Partial<User> | null = null;

			while (!user) {
				try {
					user = await Users.createUser({
						name: "Pickup Pickup",
						password: "829hdid-jdk",
						email: `123${testEmail}`,
					});
				} catch (error) {}
			}
			const userId = user.id;
			request(app)
				.get(`/api/users/${userId}`)
				.set("Accept", "application/json")
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("name");
					User.destroy({
						where: {
							id: userId,
						},
					});
				});
		});

		it(`returns throws an error user invalid id`, async () =>
			request(app)
				.get(`/api/users/invalid-5ss_ID`)
				.set("Accept", "application/json")
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.VALIDATION_ERROR)
				.then((res) => {
					expect(res.body).toHaveProperty("message");
				}));

		it(`returns throws user not found error`, async () =>
			request(app)
				.get(`/api/users/${id}`)
				.set("Accept", "application/json")
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.NOT_FOUND)
				.then((res) => {
					expect(res.body).toHaveProperty("message");
				}));
	});

	describe(`POST /users/find`, () => {
		it(`returns a of user with email`, async () => {
			let user: Partial<User>;
			const userIEmail = `123x${testEmail}`;
			user = await Users.createUser({
				name: "Pickup Pickup",
				password: "829hdid-jdk",
				email: userIEmail,
			});
			while (!user) {}

			request(app)
				.post(`/api/users/find`)
				.set("Accept", "application/json")
				.send({ email: userIEmail })
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("name");
					User.destroy({
						where: { email: userIEmail },
					});
				});
		});

		it(`returns throws an error user invalid email`, async () =>
			request(app)
				.post(`/api/users/find`)
				.set("Accept", "application/json")
				.send({ email: "testEmail" })
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.VALIDATION_ERROR)
				.then((res) => {
					expect(res.body).toHaveProperty("message");
				}));

		it(`returns throws user not found error`, async () =>
			request(app)
				.post(`/api/users/find`)
				.set("Accept", "application/json")
				.send({ email: `non_existing_${testEmail}` })
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.NOT_FOUND)
				.then((res) => {
					expect(res.body).toHaveProperty("message");
				}));
	});

	describe(`PUT /users/:id`, () => {
		it(`should update a user with id`, async () => {
			let user: Partial<User>;
			const userIEmail = `1232x${testEmail}`;
			user = await Users.createUser({
				name: "Pickup Pickup",
				password: "829hdid-jdk",
				email: userIEmail,
			});
			while (!user) {}
			const userId = user.id;

			request(app)
				.put(`/api/users/${userId}`)
				.set("Accept", "application/json")
				.send({ name: "Agbado" })
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.OK)
				.then((res) => {
					expect(res.body).toHaveProperty("name");
					User.destroy({
						where: { email: userIEmail },
					});
				});
		});

		it(`throws error on password update`, async () =>
			request(app)
				.put(`/api/users/find`)
				.set("Accept", "application/json")
				.send({ email: "testEmail" })
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.VALIDATION_ERROR)
				.then((res) => {
					expect(res.body).toHaveProperty("message");
				}));
	});

	describe(`DELETE /users/:id`, () => {
		it(`should delete user with id`, async () => {
			let user: Partial<User>;
			user = await Users.createUser({
				name: "Pickup Pickup",
				password: "829hdid-jdk",
				email: `123xx${testEmail}`,
			});

			while (!user) {}
			const userId = user.id;

			request(app)
				.delete(`/api/users/${userId}`)
				.set("Accept", "application/json")
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.OK);
		});

		it(`throws validation error`, async () =>
			request(app)
				.delete(`/api/users/xxx`)
				.set("Accept", "application/json")
				.expect("Content-type", /json/)
				.expect(HTTPStatusCode.VALIDATION_ERROR));
	});
});
