// Variables to manage trading state
let tradeActive = false;
let tradeAmountUSD = 0;
let tradeInProgress = false;
let lastTradeDetails = 'None';

// Event listeners for the start and stop buttons
document.getElementById('startButton').addEventListener('click', startTrading);
document.getElementById('stopButton').addEventListener('click', stopTrading);

// Function to start trading
function startTrading() {
    tradeAmountUSD = parseFloat(document.getElementById('tradeAmount').value);
    if (tradeAmountUSD > 0) {
        tradeActive = true;
        document.getElementById('tradeStatus').textContent = 'Trade Status: Active';
        checkForSignal(); // Start checking for signals
    } else {
        alert('Please enter a valid trade amount in USD.');
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

    // Fetch the current BTC price
    const currentPrice = await getCurrentBTCPrice();

    // Example signal check (replace with your real signal logic)
    const buySignal = true;  // Replace with your buy signal logic
    const sellSignal = false; // Replace with your sell signal logic

    if (buySignal) {
        tradeInProgress = true;
        const btcAmount = tradeAmountUSD / currentPrice;
        document.getElementById('suggestedPrice').textContent = `Suggested Buy Price: $${currentPrice.toFixed(2)}`;
        await executeTrade('BTCUSDT', 'BUY', btcAmount, currentPrice);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Bought BTC';
    } else if (sellSignal) {
        tradeInProgress = true;
        const btcAmount = tradeAmountUSD / currentPrice; // This assumes you're selling the same amount in USD
        document.getElementById('suggestedPrice').textContent = `Suggested Sell Price: $${currentPrice.toFixed(2)}`;
        await executeTrade('BTCUSDT', 'SELL', btcAmount, currentPrice);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Sold BTC';
    }

    // Simulate checking for signal every few seconds (this should be based on real-time data)
    setTimeout(() => {
        tradeInProgress = false;
        checkForSignal();
    }, 10000); // Check every 10 seconds (adjust as needed)
}

// Function to execute the trade
async function executeTrade(symbol, side, quantity, suggestedPrice) {
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

        // Update trade details
        const executionPrice = result.fills[0].price;
        lastTradeDetails = `${side} ${quantity.toFixed(6)} BTC at suggested price $${suggestedPrice.toFixed(2)}, executed at $${executionPrice}`;
        document.getElementById('tradeDetails').textContent = `Trade Details: ${lastTradeDetails}`;
        tradeInProgress = false;
    } catch (error) {
        console.error('Error executing trade:', error);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Error';
    }
}

// Function to get the current BTC price
async function getCurrentBTCPrice() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        return parseFloat(data.price);
    } catch (error) {
        console.error('Error fetching BTC price:', error);
        return 0;
    }
}
