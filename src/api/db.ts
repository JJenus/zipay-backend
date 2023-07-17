import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
	process.env.DB_NAME!,
	process.env.DB_USER!,
	process.env.DB_PASSWORD!,
	{
		host: process.env.DB_HOST,
		dialect: "mysql",
		// To add logger later
		define: {
			underscoredAll: true,
		},
	}
);

await sequelize.sync({ force: true });

export default sequelize;
