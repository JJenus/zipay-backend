import { Sequelize } from "sequelize";

const db = process.env.DB_NAME || "statsset_db";
const user = process.env.DB_USER || "root";
const pass = process.env.DB_PASSWORD || "";
const host = process.env.DB_HOST || "localhost";

let sequelize: Sequelize = new Sequelize(db, user, pass, {
	host: host,
	dialect: "mysql",
	// To add logger later
	logging: false,
	define: {
		underscored: true,
	},
});

console.log(process.env.NODE_ENV);

// if (process.env.NODE_ENV === "test") {
// 	sequelize = new Sequelize({
// 		dialect: "sqlite",
// 		storage: "./testdatabase.db",
// 	});
// } else {
// 	sequelize = new Sequelize(db, user, pass, {
// 		host: host,
// 		dialect: "mysql",
// 		// To add logger later
// 		logging: false,
// 		define: {
// 			underscored: true,
// 		},
// 	});
// }

async () => {
	await sequelize.authenticate();
};

export default sequelize;
