const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { generatePaymentLink } = require("../services/stripe");

module.exports = addKeyword(EVENTS.ACTION)
.addAnswer(`...dame un momento para generarte un link de pago`)
.addAction(async (ctx, { flowDynamic }) => {
   const link = await generatePaymentLink({priceId:'price_1Nuc4kGro21Gs0FOFzc1bQjK'})
   console.log(`[LINK]:`,link.url)
   await flowDynamic(link.url)
})