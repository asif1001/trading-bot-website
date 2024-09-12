const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { side, quantity } = req.body;

    try {
        const response = await fetch('https://your-exness-api-endpoint', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.EXNESS_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Include the necessary data based on Exness API requirements
                side,
                quantity
            })
        });

        if (!response.ok) {
            throw new Error('Trade execution failed');
        }

        const result = await response.json();
        res.status(200).json(result); // Return the result to the client-side script.js
    } catch (error) {
        console.error('Error executing trade:', error);
        res.status(500).json({ error: 'Trade execution failed' });
    }
}
