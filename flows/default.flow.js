const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { runChat } = require("../services/langchain/chat");

const paymentLayer = require("../layers/payment.layer");

module.exports = addKeyword(EVENTS.WELCOME)
    .addAction(paymentLayer)
    .addAction(async (ctx, { state, flowDynamic }) => {
        try {
            const history = state.getMyState()?.history ?? []
            const question = ctx?.body

            console.log(`[QUESTION]:`,question)
            console.log(`[HISTORY]:`,history)

            history.push({
                role: 'user',
                content: question
            })

            /** preguntar LLM */
            const { response } = await runChat(history, question)

            /** dividir respuesta por puntos seguidos y espacios saltos de linea */
            const chunks = response.split(/(?<!\d)\.\s+/g);

            history.push({
                role: 'assistant',
                content: response
            })

            for (const chunk of chunks) {
                await flowDynamic([{ body: chunk }]); // que envia el mensaje a el provider (telegram)
            }

            await state.update({ history })

        } catch (err) {
            console.log(`[ERROR]:`, err)
        }
    })