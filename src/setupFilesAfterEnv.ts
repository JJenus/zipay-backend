import sequelize from "./api/db";

global.afterAll(async () => {
	await sequelize.close();
});
