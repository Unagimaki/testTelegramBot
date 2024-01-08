const TelegramApi = require("node-telegram-bot-api") 
const {options, againOptions} = require('./options')
const token = '6405983111:AAHhbKzRWDJCEt2Icgy7iN_rg0v63r5VMRQ'
const sequelize = require('./database')
const UserModel = require('./models')
const bot = new TelegramApi(token, {polling: {autoStart: true, interval: 500}})

const chats = { 
    num: 0,
}
const startGame = async (chatID) => {
    const randomNum = Math.floor(Math.random() * 10)
    chats.num = randomNum
    await bot.sendMessage(chatID, 'Угадай число от 1 до 9: ' + randomNum)
    return bot.sendMessage(chatID, 'Отгадывай!', options)
}
const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (error) {
        console.log(error);
    }

    bot.setMyCommands([
        {
            command: '/info', description: 'Получить имя и фамилию'
        },
        {
            command: '/start', description: 'Запуск бота'
        },
        {
            command: '/game', description: 'Запуск игры'
        }
    ])


    
    bot.on('message', async msg => {
        const text = 'Ответ: ' + msg.text
        const chatID = msg.chat.id
        try {
            if (msg.text === '/start') {
                await UserModel.create({chatID})
                return bot.sendMessage(chatID, 'Вы запустили бота')
            }
            else if (msg.text === '/info') {
                const user = await UserModel.findOne({chatID})
                return bot.sendMessage(chatID, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name || ', фамилия не указана'}, у тебя правильных ${user.right} и ${user.wrong} неправильных `)
            }
            else if (msg.text === '/game') {
                startGame(chatID)
            }
            return bot.sendMessage(chatID, 'Неизвестная команда')
    
        } catch (e) {
            bot.sendMessage(chatID, 'Произошла ошибка: ' + e)
        }
    })
    bot.on('callback_query', async msg => {
        const chatID = msg.message.chat.id
        const userAnswer = msg.data
        if (userAnswer === '/game') {
            return startGame(chatID)
        }
        const user = await UserModel.findOne({chatID})
        if (+userAnswer === chats.num) {
            user.right += 1
            await bot.sendMessage(chatID, 'Верно', againOptions)
        } else {
            user.wrong += 1
            await bot.sendMessage(chatID, `Неверно`, againOptions)
        }
        await user.save()
    })
}
start()