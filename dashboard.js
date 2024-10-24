document.addEventListener('DOMContentLoaded', function() {
    // Fetching popular cryptocurrencies
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false')
        .then(response => response.json())
        .then(data => {
            const popularList = document.getElementById('popular-list');
            data.forEach(coin => {
                const li = document.createElement('li');
                li.innerHTML = `${coin.name} <span class="price">$${coin.current_price.toLocaleString()}</span>`;
                li.onclick = () => showCryptoInfo(coin); // Adding click event to show info
                popularList.appendChild(li);
            });
        });

    // Fetching gaining cryptocurrencies
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=2&sparkline=false')
        .then(response => response.json())
        .then(data => {
            const gananciasList = document.getElementById('ganancias-list');
            data.forEach(coin => {
                const li = document.createElement('li');
                li.innerHTML = `${coin.name} <span class="price">$${coin.current_price.toLocaleString()}</span>`;
                li.onclick = () => showCryptoInfo(coin); // Adding click event to show info
                gananciasList.appendChild(li);
            });
        });

    // Fetching losing cryptocurrencies
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=3&sparkline=false')
        .then(response => response.json())
        .then(data => {
            const perdidasList = document.getElementById('perdidas-list');
            data.forEach(coin => {
                const li = document.createElement('li');
                li.innerHTML = `${coin.name} <span class="price">$${coin.current_price.toLocaleString()}</span>`;
                li.onclick = () => showCryptoInfo(coin); // Adding click event to show info
                perdidasList.appendChild(li);
            });
        });

    // Fetching most viewed cryptocurrencies
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=4&sparkline=false')
        .then(response => response.json())
        .then(data => {
            const visitadosList = document.getElementById('visitados-list');
            data.forEach(coin => {
                const li = document.createElement('li');
                li.innerHTML = `${coin.name} <span class="price">$${coin.current_price.toLocaleString()}</span>`;
                li.onclick = () => showCryptoInfo(coin); // Adding click event to show info
                visitadosList.appendChild(li);
            });
        });

    // Function to show cryptocurrency information
    function showCryptoInfo(coin) {
        const cryptoInfo = document.getElementById('crypto-info');
        cryptoInfo.innerHTML = `
            <h3>${coin.name}</h3>
            <p>Current Price: $${coin.current_price.toLocaleString()}</p>
            <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
            <p>24h High: $${coin.high_24h.toLocaleString()}</p>
            <p>24h Low: $${coin.low_24h.toLocaleString()}</p>
            <p>Price Change (24h): $${coin.price_change_24h.toLocaleString()}</p>
            <p>Percentage Change (24h): ${coin.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Demand Explanation: Cuando hay más demanda de ${coin.name}, el precio sube. Cuando hay menos demanda, el precio baja.</p>
            <canvas id="price-chart"></canvas>`;
            
        // Displaying a chart
        const ctx = document.getElementById('price-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['24h Low', 'Current', '24h High'],
                datasets: [{
                    label: 'Price in USD',
                    data: [coin.low_24h, coin.current_price, coin.high_24h],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
});
