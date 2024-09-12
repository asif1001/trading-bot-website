async function executeTrade(side, quantity, suggestedPrice) {
    try {
        const response = await fetch('https://your-vercel-domain.vercel.app/api/trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ side, quantity })
        });

        if (!response.ok) {
            throw new Error('Trade execution failed');
        }

        const result = await response.json();
        console.log('Trade executed:', result);

        // Update trade details
        const executionPrice = result.executionPrice; // Assuming Exness returns this
        lastTradeDetails = `${side} ${quantity.toFixed(6)} units at suggested price $${suggestedPrice.toFixed(2)}, executed at $${executionPrice}`;
        document.getElementById('tradeDetails').textContent = `Trade Details: ${lastTradeDetails}`;

        // Monitor for profit or loss
        monitorTrade(side, executionPrice, quantity);

    } catch (error) {
        console.error('Error executing trade:', error);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Error';
    }
}
