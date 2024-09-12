// Variables to manage trading state
let tradeActive = false;
let tradeAmount = 0;
let tradeInProgress = false;
let lastTradeDetails = 'None';

// Event listeners for the start and stop buttons
document.getElementById('startButton').addEventListener('click', startTrading);
document.getElementById('stopButton').addEventListener('click', stopTrading);

// Function to start trading
function startTrading() {
    tradeAmount = parseFloat(document.getElementById('tradeAmount').value);
    if (tradeAmount > 0) {
        tradeActive = true;
        document.getElementById('tradeStatus').textContent = 'Trade Status: Active';
        checkForSignal(); // Start checking for signals
    } else {
        alert('Please enter a valid trade amount.');
    }
}

// Function to stop trading
function stopTrading() {
    tradeActive = false;
    document.getElementById('tradeStatus').textContent = 'Trade Status: Stopped';
}

// Function to check for buy/sell signals
async function checkForSignal() {
    if (!tradeActive || tradeInProgress) return;

    // Example signal check (replace with your real signal logic)
    const buySignal = true;  // Replace with your buy signal logic
    const sellSignal = false; // Replace with your sell signal logic

    if (buySignal) {
        tradeInProgress = true;
        await executeTrade('BTCUSDT', 'BUY', tradeAmount);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Bought BTC';
    } else if (sellSignal) {
        tradeInProgress = true;
        await executeTrade('BTCUSDT', 'SELL', tradeAmount);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Sold BTC';
    }

    // Simulate checking for signal every few seconds (this should be based on real-time data)
    setTimeout(() => {
        tradeInProgress = false;
        checkForSignal();
    }, 10000); // Check every 10 seconds (adjust as needed)
}

// Function to execute the trade
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
        tradeInProgress = false;

        // Update trade details
        lastTradeDetails = `${side} ${quantity} of ${symbol} at price ${result.fills[0].price}`;
        document.getElementById('tradeDetails').textContent = `Trade Details: ${lastTradeDetails}`;
    } catch (error) {
        console.error('Error executing trade:', error);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Error';
    }
}
