// Descriptive Purpose:
const descriptivePurposes = [
    "Collateral",
    "Deposit",
    "Inbound Transfer",
    "Interest and Rewards",
    "Internal Account Transfer",
    "Loan Interest Liquidation",
    "Loan Interest Payment",
    "Loan Principal Liquidation",
    "Loan Principal Payment",
    "Operation Cost",
    "Outbound Transfer",
    "Swap In",
    "Swap Out",
    "Withdrawal"
]

// Types:
const types = [
    "Outgoing",
    "Incoming"
]

// Tokens:
// 'ETH'
// 'BTC'
// 'USDC'
// 'CEL'
// 'LTC'
// 'BCH'
// 'MANA'
// 'MATIC'
// 'ADA'
// 'LINK'
// 'SNX'
// 'AAVE'
// 'UNI'
// 'OMG'
// 'SUSHI'
// 'UMA'
// 'XTZ'
// 'MCDAI'
// 'ZEC'
// 'DOGE'
// 'DOT'
// 'SOL'
// 'AVAX'
// 'USDT ERC20'
// 'GUSD'
// 'XRP'
// 'LUNC'
// 'DASH'
// 'COMP'
// 'BNB'
// 'PAXG'
// 'XLM'
// 'BAT'
// 'BUSD'
// 'EOS'
// 'BSV'
// 'PAX'
// 'ETC'
// 'ZRX'
// 'SGB'
// 'TCAD'
// 'KNC'
// 'TAUD'
// 'SPARK'
// 'TUSD'
// 'UST'
// 'THKD'
// 'BNT'
// 'TGBP'
// 'LPT'
// 'MKR'
// 'WBTC'
// 'XAUT'
// 'CRV'
// 'ZUSD'
// 'BADGER'
// 'YFI'
// 'CVX'
// 'WDGLD'

let coins = new Set([])

function reconstruct(page) {

    const continuousPage = page.flat()

    let isLastTokenAMark = false
    let stack = ""
    let inCoin = false
    let coin = ""
    for(let i = 0; i < continuousPage.length; i++) {
        const token = continuousPage[i]
        if (token === "🟥") {
            continue
        }
        if (inCoin) {
            if (/^(\d|\()/.test(token)) {
                inCoin = false
                coins.add(coin)
                coin = ""
            }
            else {
                coin += token.trim()
            }
        }
        if (isLastTokenAMark) {
            stack += token
            if (descriptivePurposes.includes(stack)) {
                stack = ""
                isLastTokenAMark = false
                inCoin = true
            }
        }
        else {
            isLastTokenAMark = types.includes(token)
        }
    }
    console.log(stack)
    return isLastTokenAMark || inCoin
}


for (let i = 47; i <= 14384; i++) {
    const pageNum = i - 46

    // const pageNum = 1
    const page = require(`./json-pass-1/coin_transactions_page_${pageNum}.json`);
    if (reconstruct(page)) {
        throw new Error("Page " + pageNum + " ended with a mark")
    }
    else {
        console.log('processed page ' + pageNum);
    }
}
console.log(coins)
