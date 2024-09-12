// Variables to manage trading state
let tradeActive = false;
let tradeAmountUSD = 0;
let tradeInProgress = false;
let lastTradeDetails = 'None';
let transactionCount = 0;
let transactions = [];

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

// Function to check for buy/sell signals based on an indicator (e.g., MACD or RSI)
async function checkForSignal() {
    if (!tradeActive || tradeInProgress) return;

    // Fetch the current BTC price
    const currentPrice = await getCurrentBTCPrice();

    // Fetch the indicator's signal (replace with actual logic)
    const signal = await getTradingSignal();

    if (signal === 'BUY') {
        tradeInProgress = true;
        const btcAmount = tradeAmountUSD / currentPrice;
        document.getElementById('suggestedPrice').textContent = `Suggested Buy Price: $${currentPrice.toFixed(2)}`;
        await executeTrade('BTCUSDT', 'BUY', btcAmount, currentPrice);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Bought BTC';
    } else if (signal === 'SELL') {
        tradeInProgress = true;
        const btcAmount = tradeAmountUSD / currentPrice;
        document.getElementById('suggestedPrice').textContent = `Suggested Sell Price: $${currentPrice.toFixed(2)}`;
        await executeTrade('BTCUSDT', 'SELL', btcAmount, currentPrice);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Sold BTC';
    } else {
        document.getElementById('suggestedPrice').textContent = `No clear signal. Waiting for next signal...`;
    }

    // Check again after a delay
    setTimeout(() => {
        tradeInProgress = false;
        checkForSignal();
    }, 10000); // Check every 10 seconds (adjust as needed)
}

// Function to execute the trade on Binance
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

        // Confirm trade execution status
        if (result.status === 'FILLED') {
            document.getElementById('tradeStatus').textContent = `Trade Executed Successfully at $${executionPrice}`;
            recordTransaction(side, suggestedPrice, executionPrice, quantity, tradeAmountUSD);
        } else {
            document.getElementById('tradeStatus').textContent = `Trade Status: ${result.status}`;
        }

        tradeInProgress = false;
    } catch (error) {
        console.error('Error executing trade:', error);
        document.getElementById('tradeStatus').textContent = 'Trade Status: Error';
    }
}

// Function to record the transaction in the table
function recordTransaction(type, openPrice, closePrice, volume, usdAmount) {
    transactionCount++;
    const profitOrLoss = (closePrice - openPrice) * volume;
    transactions.push({
        srNo: transactionCount,
        type: type,
        openPrice: openPrice.toFixed(2),
        closePrice: closePrice.toFixed(2),
        volume: volume.toFixed(6),
        usdAmount: usdAmount.toFixed(2),
        profitOrLoss: profitOrLoss.toFixed(2)
    });
    updateTransactionTable();
}

// Function to update the transaction history table
function updateTransactionTable() {
    const tableBody = document.querySelector('#transactionTable tbody');
    tableBody.innerHTML = ''; // Clear the table

    transactions.forEach((transaction) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.srNo}</td>
            <td>${transaction.type}</td>
            <td>$${transaction.openPrice}</td>
            <td>$${transaction.closePrice}</td>
            <td>${transaction.volume} BTC</td>
            <td>$${transaction.usdAmount}</td>
            <td>$${transaction.profitOrLoss}</td>
        `;
        tableBody.appendChild(row);
    });
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

// Function to get the trading signal based on an indicator (replace with actual logic)
async function getTradingSignal() {
    // Example placeholder logic (replace with actual indicator logic)
    const randomSignal = Math.random();
    if (randomSignal > 0.5) {
        return 'BUY';
    } else if (randomSignal < 0.5) {
        return 'SELL';
    } else {
        return 'HOLD';
    }
}
