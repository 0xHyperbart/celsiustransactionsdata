const fs = require('fs')

function cleanPage(pageNum) {
    const page = require(`./json/coin_transactions_page_${pageNum}.json`);
    const cleanedPage = []
    for(let i = 0; i < page.length; i++) {
        const line = page[i];
        if (line[0].startsWith('Statement of Financial Affairs for Non-Individuals Filing')) {
            continue
        }
        if (line[0].startsWith('SOFA Question 3')) {
            continue
        }
        if (line[0].startsWith('Coin Transactions')) {
            continue
        }
        if (line[0].includes("Entered 10/05/22 22:13:10    Main Document")) {
            continue
        }
        cleanedPage.push(line)
    }
    return cleanedPage
}

function reconstructTable(page) {
    // USERNAME
    // ADDRESS
    // DATE
    // ACCOUNT
    // TYPE
    // Descriptive Purpose
    // COIN
    // COIN QUANTITY
    // COIN USD
    let stack = []
    let table = []
    for (let i = 0; i < page.length; i++) {
        const line = page[i];
        for (let j = 0; j < line.length; j++) {
            const item = line[j];
            
            if (item.startsWith('ADDRESS REDACTED')) {
                if (table[table.length - 1] && !table[table.length - 1].includes('ADDRESS REDACTED')) {
                    table[0] = [...table[0], ...stack]
                }
                else {
                    table.push(stack)
                }
                stack = []
            }
            stack.push(item)
        }
        stack.push('🟥')
    }
    table.push(stack)
    stack = []
    return table
}

for (let i = 47; i <= 14384; i++) {
    const pageNum  = i - 46
    const table = reconstructTable(cleanPage(pageNum))
    fs.writeFile(`./json-pass-1/coin_transactions_page_${pageNum}.json`, JSON.stringify(table, null, 2), (err) => {
        console.log('processed page ' + pageNum);
    });
}