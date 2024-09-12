// Replace 'YOUR_API_KEY' and 'YOUR_API_SECRET' with your actual Binance API key and secret
const apiKey = 'FciR4358ECC9cH2mSqZI5dSAt8DdmI2DHohXy3U3jasVgo5fj911KA4Jmkk7NHcC';
const apiSecret = 'wBJSTTIBkjR0Pjf4q2xT37iCi0MNT6DGmUjBTJeoHoCLRFxC0YG7CXgAG1RlCAml';

// Function to fetch BTC/USD price data from Binance
async function fetchBTCPrice() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        console.log('BTC/USD Price:', data.price);
        // Display the price on the webpage
        document.getElementById('btc-price').textContent = `BTC/USD: $${data.price}`;
    } catch (error) {
        console.error('Error fetching BTC price:', error);
    }
}

// Function to fetch Gold/USD price data from Binance
async function fetchGoldPrice() {
    try {
        // Binance does not directly support Gold/USD, but you could use a proxy like XAUUSD
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=XAUUSD');
        const data = await response.json();
        console.log('Gold/USD Price:', data.price);
        // Display the price on the webpage
        document.getElementById('gold-price').textContent = `Gold/USD: $${data.price}`;
    } catch (error) {
        console.error('Error fetching Gold price:', error);
    }
}

// Call the functions to fetch data
fetchBTCPrice();
fetchGoldPrice();
