import Sequelize from 'sequelize';

const sequelize = new Sequelize("auth-db", "admin", "82cbddb0", {
    host: "localhost",
    dialect: "postgres",
    quoteIdentifiers: false,
    define: {
        syncAssociation: true,
        timestamps: false,
        underscored: true,
        underscoredAll: true,
        freezeTableName: true
    },
});

sequelize.authenticate().then(() => {
    console.info("Connection has been established");
}).catch(err => {
    console.error("Unable to connect to the database.");
    console.error(err.message);
});

export default sequelize;