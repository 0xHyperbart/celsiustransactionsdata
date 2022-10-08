const fs = require('fs')
const usernames = require('./usernames/usernames.json')

// Accounts:
const accounts = [
    "Earn - Interest; Earn, Custody or Withheld - Rewards",
    "Earn",
    "Custody",
    "Witheld",
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

function validateFieldsNotNull(page) {
    // validate all fields are filled out (not null) (apart from coinUSD)
    for(let i = 0; i < page.length; i++) {
        const row = page[i]
        if (!row.username) {
            return false
        }
        if (!row.address) {
            return false
        }
        if (!row.date) {
            return false
        }
        if (!row.account) {
            return false
        }
        if (!row.type) {
            return false
        }
        if (!row.descriptivePurpose) {
            return false
        }
        if (!row.coin) {
            return false
        }
        if (!row.coinQuantity) {
            return false
        }
        if (!row.coinUSD) {
            // console.log(row.coinUSD)
            // return false
        }
    }
    return true
}

function validatePageRowCount(page, i) {
    if (page.length === 221) {
        return true // normal page
    }
    if (page.length === 12 && i === 4570) {
        return true // exception page
    }
    if (page.length === 135 && i === 9093) {
        return true // exception page
    }
    if (page.length === 187 && i === 13622) {
        return true // exception page
    }
    if (page.length === 78 && i === 14384) {
        return true // last page
    }

    return false
}

for (let i = 47; i <= 14384; i++) {
    const pageNum = i - 46
    const page = require(`./json-pass-2/coin_transactions_${pageNum}.json`);


    // validate we use all usernames
    // list addresses
    // validate dates
    // validate accounts are not too variant
    // validate types are not too variant
    // validate descriptive purposes are not too variant
    // validate coins are not too variant
    // validate coinUSD always having 2 decimal place for cents
    // validate outgoing always being a negative amount

    if (!validatePageRowCount(page, i)) {
        throw new Error(`Page ${pageNum} doesn't have the right number of rows.`)
    }

    if (!validateFieldsNotNull(page)) {
        throw new Error(`Page ${pageNum} doesn't have all fields filled out.`)
    }

}
