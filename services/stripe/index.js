const stripe = require('stripe')(process.env.STRIPE_SK);

generatePaymentLink = async (data) => {
    try {
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price: data.priceId,
                    quantity: 1,
                },
            ],
            after_completion: { type: 'redirect', redirect: { url: `https://app.codigoencasa.com/courses/libera-el-poder-de-tus-datos` } },
            allow_promotion_codes: true,
            customer_creation: 'always'
        });

        return paymentLink
    } catch (err) {
        console.error(err)
    }
}

module.exports = { generatePaymentLink }