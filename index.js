const TelegramApi = require("node-telegram-bot-api") 
const {options, againOptions} = require('./options')
const token = '6405983111:AAHhbKzRWDJCEt2Icgy7iN_rg0v63r5VMRQ'

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
const start = () => {

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
        if (msg.text === '/start') {
            return bot.sendMessage(chatID, 'Вы запустили бота')
        }
        else if (msg.text === '/info') {
            return bot.sendMessage(chatID, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name || ', фамилия не указана'}`)
        }
        else if (msg.text === '/game') {
            startGame(chatID)
        }
        return bot.sendMessage(chatID, 'Неизвестная команда')
    })
    bot.on('callback_query', async msg => {
        const chatID = msg.message.chat.id
        const userAnswer = msg.data
        if (userAnswer === '/game') {
            return startGame(chatID)
        }
        await console.log(userAnswer)
        await console.log('saved: ' + chats.num);
        await bot.sendMessage(chatID, 'Твой ответ ' + userAnswer)
        return bot.sendMessage(chatID, `И это ${+userAnswer === chats.num ? 'верно' : 'неверно'}. Играть еще?`, againOptions)
    })
}
start()