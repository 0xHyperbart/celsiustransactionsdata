const fs = require('fs')
const usernames = require('./usernames/usernames.json')

// Accounts:
const accounts = [
    "Earn - Interest; Earn, Custody or Withheld - Rewards",
    "Earn",
    "Custody",
    "Witheld"
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

for (let i = 47; i <= 14384; i++) {
    const pageNum = i - 46
    const page = require(`./json-pass-2/coin_transactions_${pageNum}.json`);

    if (page.length === 221) {
        continue // ok
    }
    if (page.length === 12 && i === 4570) {
        continue // ok
    }
    if (page.length === 78 && i === 14384) {
        continue // ok
    }

    console.log(`Page ${pageNum} is not valid. Page length: ${page.length}`)
}
