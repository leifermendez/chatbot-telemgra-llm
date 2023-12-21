require('dotenv').config()
const { createProvider, createBot, createFlow } = require('@bot-whatsapp/bot')

const TelegramProvider = require('./telegram.provider')
const MockAdapter = require('@bot-whatsapp/database/mock');
const defaultFlow = require('./flows/default.flow');
const payFlow = require('./flows/pay.flow');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || null;

/**
 * Es la funcion encargada de levantar el ChatBOT
 */
const main = async () => {

    const adapterDB = new MockAdapter()
    const adapterProvider = createProvider(TelegramProvider, { token: TELEGRAM_TOKEN })
    const adapterFlow = createFlow([defaultFlow, payFlow])

    createBot(
        {
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        }
    )
}

main()
