const fs = require('fs')
function flatten(page) {
    for(let i = 0; i < page.length; i++) {
        const row = page[i]
        row.date = row.date.join('')
        row.coinQuantity = row.coinQuantity.join('')
        row.coinUSD = row.coinUSD && row.coinUSD.length > 0 ? row.coinUSD.join('') : null
        row.address = row.address.join('')
        row.coin = row.coin === 'USDTERC20' ? 'USDT ERC20' : row.coin
    }
    return page
}

for (let i = 47; i <= 14384; i++) {
    const pageNum = i - 46
    // TODO: use similar file format
    const page = require(`./json-pass-2/coin_transactions_${pageNum}.json`);
    const table = flatten(page)
    fs.writeFile(`./json-pass-3/coin_transactions_${pageNum}.json`, JSON.stringify(table, null, 2), (err) => {
        console.log('processed page ' + pageNum);
    });
}
