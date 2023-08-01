import sequelize from "./common/db";

global.afterAll(async () => {
	// try {
	// 	await sequelize.close();
	// 	console.log("Database connection closed successfully.");
	// } catch (error) {
	// 	console.error("Error closing database connection:", error);
	// }
});
