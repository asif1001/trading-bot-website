async function executeTrade(symbol, side, quantity) {
    try {
        const response = await fetch('https://your-vercel-domain.vercel.app/api/trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symbol, side, quantity })
        });

        if (!response.ok) {
            throw new Error('Trade execution failed');
        }

        const result = await response.json();
        console.log('Trade executed:', result);
    } catch (error) {
        console.error('Error executing trade:', error);
    }
}

// Example usage:
// executeTrade('BTCUSDT', 'BUY', 0.001);
