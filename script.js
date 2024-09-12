let tradeActive = false;
let tradeAmount = 0;
let tradeInProgress = false;

document.getElementById('startButton').addEventListener('click', startTrading);
document.getElementById('stopButton').addEventListener('click', stopTrading);

function startTrading() {
    tradeAmount = parseFloat(document.getElementById('tradeAmount').value);
    if (tradeAmount > 0) {
        tradeActive = true;
        document.getElementById('tradeStatus').textContent = 'Trade Status: Active';
        checkForSignal();
    } else {
        alert('Please enter a valid trade amount.');
    }
}

function stopTrading() {
    tradeActive = false;
    document.getElementById('tradeStatus').textContent = 'Trade Status: Stopped';
}
