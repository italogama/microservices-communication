import Sequelize from 'sequelize';

import { DB_HOST, DB_NAME , DB_USER, DB_PASSWORD, DB_PORT } from '../constants/secrets.js';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    quoteIdentifiers: false,
    define: {
        syncAssociation: true,
        timestamps: false,
        underscored: true,
        underscoredAll: true,
        freezeTableName: true
    },
    pool: {
        acquire: 180000,
    },
});

sequelize.authenticate().then(() => {
    console.info("Connection has been established");
}).catch(err => {
    console.error("Unable to connect to the database.");
    console.error(err.message);
});

export default sequelize;