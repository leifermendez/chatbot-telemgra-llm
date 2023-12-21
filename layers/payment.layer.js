const payFlow = require("../flows/pay.flow");
const { chat } = require("../services/openai");

const PROMPT = `
Investiga la siguiente conversación entre un vendedor y un cliente. Tu tarea es entender si el cliente ha señalado explícitamente su preferencia por hacer el pago con tarjeta.
--------------
"%HISTORY%"
--------------
Si el cliente ha confirmado su interés en pagar con tarjeta, responde con "DONE". Sin embargo, si no hay una confirmación clara por parte del cliente, responde con "WAIT".
¿Cuál es tu respuesta? (DONE | WAIT):`;

/**
 * 
 * @param {*} history 
 * @returns 
 */
const buildTemplate = (history = []) => {
    const parseTxt = [...history].reverse();
    const tmp = [];

    for (let index = 0; index < 6; index++) {
        const element = parseTxt[index];
        if (element?.role === "assistant") {
            tmp.push(`Seller:{${element.content}}`);
        }
        if (element?.role === "user") {
            tmp.push(`Customer:{${element.content}}`);
        }
    }

    const fullTxt = tmp.reverse().join("\n");
    const txt = PROMPT.replace("%HISTORY%", fullTxt);
    return txt;
};


module.exports = async (ctx, { state, gotoFlow }) => {
    try {
        const messages = state.getMyState()?.history ?? []

        if (!messages.length) {
            return null;
        }

        const prompt = buildTemplate(messages);
        const response = await chat(prompt, ctx.body)


        console.log(`[INTENCION]:`,response.content) //WAIT o DONE

        if (response.content.includes("DONE")) {
            await gotoFlow(payFlow);
            return;
        }
        return ;


    } catch (error) {
        console.log(`[ERROR]:`, error)
        return
    }
}