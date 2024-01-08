const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'telegramBotBD',
    'rootUser',
    'root',
    {
        host: '79.143.24.83',
        port: '5432',
        dialect: 'postgres'
    }
)