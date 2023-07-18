import { Sequelize } from "sequelize";

const db = process.env.DB_NAME || "statsset_db";
const user = process.env.DB_USER || "root";
const pass = process.env.DB_PASSWORD || "";
const host = process.env.DB_HOST || "localhost";

const sequelize = new Sequelize(db, user, pass, {
	host: host,
	dialect: "mysql",
	// To add logger later
	define: {
		underscored: true,
	},
});

export default sequelize;
