const { ProviderClass } = require('@bot-whatsapp/bot')
const TelegramBot = require("node-telegram-bot-api");

class TelegramProvider extends ProviderClass {
    vendor
    constructor({ token }) {
        super()
        this.vendor = new TelegramBot(token, { polling: true });
        const listEvents = this.busEvents()
        for (const { event, func } of listEvents) {
            this.vendor.on(event, func)
        }

        this.vendor.on('polling_error', (error) => {
            // console.log(error)
            console.log("Polling error code: ", error.code);
            console.log("Error Message: ", error.message);
            console.log("Stack trace: ", error.stack);
        });
    }

    /**
     * Mapeamos los eventos nativos de  whatsapp-web.js a los que la clase Provider espera
     * para tener un standar de eventos
     * @returns
     */
    busEvents = () => [
        {
            event: 'message',
            func: (payload) => {
                payload = { ...payload, from: payload.chat.id, body:payload.text }
                console.log(`payload`, payload)
                this.emit('message', payload)
            },
        },
    ]

    /**
     *
     * @param {*} number
     * @param {*} message
     * @param {*} param2
     * @returns
     */
    sendMessage = async (number, message, { options } = { options: {} }) => {
        return  this.vendor.sendMessage(number, message);
    }
}

module.exports = TelegramProvider