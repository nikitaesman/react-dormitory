const {Sequelize } = require('sequelize')
const config = require("config");

const sequelize = new Sequelize(config.get('DB').database, config.get('DB').user, config.get('DB').password, {
    host: config.get('DB').host,
    dialect: 'mariadb'
});

module.exports = sequelize