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

    if (!symbol || !side || !quantity) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        // Place an order on Binance
        const order = await binance.order({
            symbol: symbol,
            side: side, // 'BUY' or 'SELL'
            quantity: quantity,
            type: 'MARKET' // Market order, you can change this to 'LIMIT' if needed
        });

        // Send back the order details
        res.status(200).json(order);
    } catch (error) {
        console.error('Error executing trade:', error);
        res.status(500).json({ message: 'Trade execution failed', error: error.message });
    }
}
