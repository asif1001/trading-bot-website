// Replace 'YOUR_API_KEY' and 'YOUR_API_SECRET' with your actual Binance API key and secret
const apiKey = 'FciR4358ECC9cH2mSqZI5dSAt8DdmI2DHohXy3U3jasVgo5fj911KA4Jmkk7NHcC';
const apiSecret = 'wBJSTTIBkjR0Pjf4q2xT37iCi0MNT6DGmUjBTJeoHoCLRFxC0YG7CXgAG1RlCAml';

// Function to fetch BTC/USD price data from Binance
async function fetchBTCPrice() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        const price = parseFloat(data.price);
        console.log('BTC/USD Price:', price);

        document.getElementById('btc-price').textContent = `BTC/USD: $${price}`;

        // Basic trading logic example
        if (price > 30000) {
            console.log('Sell Signal');
            document.getElementById('btc-price').textContent += ' (Sell Signal)';
        } else {
            console.log('Buy Signal');
            document.getElementById('btc-price').textContent += ' (Buy Signal)';
        }
    } catch (error) {
        console.error('Error fetching BTC price:', error);
    }
}

// Call the function to fetch data on page load
fetchBTCPrice();
