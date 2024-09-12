const Binance = require('node-binance-api');

const binance = new Binance().options({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_API_SECRET
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { symbol, side, quantity } = req.body;

    try {
        const order = await binance.order({
            symbol: symbol,
            side: side,  // 'BUY' or 'SELL'
            quantity: quantity,
            type: 'MARKET'  // or 'LIMIT', etc.
        });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
