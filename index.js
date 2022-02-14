const TelegrapApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5282843421:AAGRP_obnPuv54MxWFH6hZyjDOr8zR_35hQ'

const bot = new TelegrapApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Одобряю. Игры вообще отличный инструмент естественного отбора.')
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 1 до 9, а ты должен ее отгадать, неотёсанный орк')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай, черт возьми', gameOptions);
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о себе'},
        {command: '/game', description: 'Сыграть в игру'},
    
    ])
    
   bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
        await bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот великого Кешуса!')
        return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/345/f75/345f75a5-5aa3-3b70-842f-457f4fd54150/192/18.webp')
        }
        if (text === '/info') {
        return bot.sendMessage(chatId, `Твое никчемное имя ${msg.from.first_name}. В свидетельстве о крещении звучит получше.`);
        }
        if (text === '/game') {
            return startGame(chatId)
            }
        return bot.sendMessage(chatId, 'Ты сморозил какую то бездоказательную банальность или откровенную чушь.')
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
        return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, 'Меткий глаз. Молодец. Поиграй ещё.', againOptions)
        } else {
            return bot.sendMessage(chatId, `Нифига. Это была цифра ${chats[chatId]}`, againOptions)
        }

    })
}

start()
