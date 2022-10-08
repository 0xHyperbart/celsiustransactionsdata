const fs = require('fs')
const usernames = require('./usernames/usernames.json')
const { isDate, isDateish, trimTokens } = require('./utils')

// Accounts:
const accounts = [
    "Earn - Interest; Earn, Custody or Withheld - Rewards",
    "Earn",
    "Custody",
    "Withheld"
]

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

// Coins:
const coins = [
    'ETH', 'BTC', 'USDC', 'CEL', 'LTC', 'BCH', 'MANA', 'MATIC', 'ADA', 'LINK',
    'SNX', 'AAVE', 'UNI', 'OMG', 'SUSHI', 'UMA', 'XTZ', 'MCDAI', 'ZEC', 'DOGE',
    'DOT', 'SOL', 'AVAX', 'USDT ERC20', 'GUSD', 'XRP', 'LUNC', 'DASH', 'COMP',
    'BNB', 'PAXG', 'XLM', 'BAT', 'BUSD', 'EOS', 'BSV', 'PAX', 'ETC', 'ZRX',
    'SGB', 'TCAD', 'KNC', 'TAUD', 'SPARK', 'TUSD', 'UST', 'THKD', 'BNT', 'TGBP',
    'LPT', 'MKR', 'WBTC', 'XAUT', 'CRV', 'ZUSD', 'BADGER', 'YFI', 'CVX', 'WDGLD'
]

function reconstruct(page) {
    const contPage = page.flat()

    function next() {
        const next = contPage.shift()
        if (next === undefined) {
            return null
        }
        return next
    }

    let stack = []

    let mode = "username"
    let username = []
    let address = []
    let date = []
    let account = []
    let type = []
    let descriptivePurpose = []
    let coin = []
    let coinQuantity = []
    let coinUSD = []

    let table = []

    while(true) {
        const token = next()
        if (token === null) {
            break
        }

        if (mode === "address") {
            if (isDate(token) || isDateish(token)) {
                mode = "date"
                address = stack
                stack = [token]
                continue
            }
        }

        if (mode === "date") {
            // TODO: might not work if token is just "Ear"
            if (token.startsWith("Earn") || token.startsWith('Custody') || token.startsWith('Withheld')) {
                mode = "account"
                date = trimTokens(stack)
                stack = [token]
                continue
            }
        }

        if (mode === "coin_quantity") {
            if (token[0] == '$' || token[1] == '$') {
                mode = "coin_usd"
                coinQuantity = stack
                stack = [token]
                continue
            }
        }


        if (mode === "account") {
            if (accounts.includes(stack.join(''))) {
                mode = "type"
                account = stack.join('')
                stack = [token]
                continue
            }
        }
        if (mode === "type") {
            if (types.includes(stack.join(''))) {
                mode = "descriptive_purpose"
                type = stack.join('')
                stack = [token]
                continue
            }
        }
        if (mode === "descriptive_purpose") {
            if (descriptivePurposes.includes(stack.join(''))) {
                mode = "coin"
                descriptivePurpose = stack.join('')
                stack = [token]
                continue
            }
        }
        if (mode === "coin") {
            if (coins.includes(stack.join(''))) {
                mode = "coin_quantity"
                coin = stack.join('')
                stack = [token]
                continue
            }
        }
        if (mode === "coin_usd") {
            if (token === '🟥') {
                mode = "username"
                coinUSD = stack
                const row = {
                    username,
                    address,
                    date,
                    account,
                    type,
                    descriptivePurpose,
                    coin,
                    coinQuantity,
                    coinUSD
                }
                table.push(row)
                username = null
                address = null
                date = null
                account = null
                type = null
                descriptivePurpose = null
                coin = null
                coinQuantity = null
                coinUSD = null

                stack = []
                continue
            }
        }

        stack.push(token)

        if (mode === "username") {
            if (usernames[stack.join('')]) {
                mode = "address"
                username = stack
                stack = []
                continue
            }
        }
    }
    const row = {
        username,
        address,
        date,
        account,
        type,
        descriptivePurpose,
        coin,
        coinQuantity,
        coinUSD
    }
    console.log('mode', mode)

    table.push(row)
    return table
}

for (let i = 47; i <= 14384; i++) {
    const pageNum = i - 46
    const page = require(`./json-pass-1/coin_transactions_page_${pageNum}.json`);
    const table = reconstruct(page)
    fs.writeFile(`./json-pass-2/coin_transactions_${pageNum}.json`, JSON.stringify(table, null, 2), (err) => {
        console.log('processed page ' + pageNum);
    });
}
