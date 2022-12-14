const fs = require('fs')
const usernames = require('./usernames/usernames.json')
const { isDate, isDateish, trimTokens, isNumericFully, isDollarSign } = require('./utils')

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
    'DOT', 'SOL', 'AVAX', 'USDTERC20', 'GUSD', 'XRP', 'LUNC', 'DASH', 'COMP',
    'BNB', 'PAXG', 'XLM', 'BAT', 'BUSD', 'EOS', 'BSV', 'PAX', 'ETC', 'ZRX',
    'SGB', 'TCAD', 'KNC', 'TAUD', 'SPARK', 'TUSD', 'UST', 'THKD', 'BNT', 'TGBP',
    'LPT', 'MKR', 'WBTC', 'XAUT', 'CRV', 'ZUSD', 'BADGER', 'YFI', 'CVX', 'WDGLD',
    '1INCH'
]

function coinMatch(tokens) {
    const trimmedSpaceTokens = tokens.map(token => token.replace(/\s+/g, ''))
    const trimmedTokens = trimTokens(trimmedSpaceTokens)
    const coinToCheck = trimmedTokens.join('')
    return coins.includes(coinToCheck)
}

function isThai(token) {
    var re = new RegExp("[ๅภถุึคตจขชๆไำพะัีรนยบลฃฟหกดเ้่าสวงผปแอิืทมใฝ๑๒๓๔ู฿๕๖๗๘๙๐ฎฑธํ๊ณฯญฐฅฤฆฏโฌ็๋ษศซฉฮฺ์ฒฬฦ]+", "g");
    return re.test(token)
}

function reconstruct(page, pageNum) {
    const contPage = page.flat()

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

    function next() {
        const next = contPage.shift()
        if (next === undefined) {
            return null
        }
        return next
    }
    function lookAhead() {
        return contPage[0]
    }
    function lookAhead13() {
        return contPage.slice(0, 13)
    }
    function lookAhead8() {
        return contPage.slice(0, 8)
    }
    function endRow() {
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
    }


    while(true) {
        const token = next()
        if (token === null) {
            break
        }

        if (mode === "address") {
            if (isDate(token) || isDateish(token)) {
                mode = "date"
                address = trimTokens(stack)
                stack = [token]
                continue
            }
        }

        if (mode === "date") {
            const tokenAndLookahead = token + lookAhead()
            if (tokenAndLookahead.startsWith("Earn") || tokenAndLookahead.startsWith('Custody') || tokenAndLookahead.startsWith('Witheld') || tokenAndLookahead.startsWith('Withheld')) {
                mode = "account"
                date = trimTokens(stack)
                stack = [token]
                continue
            }
        }

        if (mode === "coin_quantity") {
            if (token === '🟥') {
                const lookingAhead = lookAhead()
                if (lookingAhead && isNumericFully(lookingAhead)) {
                    lookaheadToken = next()
                    coinQuantity = [...stack, lookaheadToken]
                    mode = 'coin_usd'
                    stack = []
                    continue
                }
                else if (lookingAhead && isDollarSign(lookingAhead)) {
                    coinQuantity = [...stack]
                    mode = 'coin_usd'
                    stack = []
                    continue
                }
                else {
                    coinQuantity = stack
                    mode = 'username'
                    stack = []
                    endRow()
                    continue
                }
            }
            if (token[0] == '(' || token[0] == '$' || token[1] == '$') {
                mode = "coin_usd"
                coinQuantity = stack
                stack = [token]
                continue
            }
        }


        if (mode === "account") {
            if (accounts.includes(trimTokens(stack).join(''))) {
                const accountHere = trimTokens([...stack, token]).join('')
                if (accounts.includes(accountHere)) {
                    mode = "type"
                    account = accountHere
                    stack = []
                    continue
                }
                else {
                    mode = "type"
                    account = trimTokens(stack).join('')
                    stack = [token]
                    continue    
                }
            }
        }
        if (mode === "type") {
            if (types.includes(trimTokens(stack).join(''))) {
                mode = "descriptive_purpose"
                type = trimTokens(stack).join('')
                stack = [token]
                continue
            }
        }
        if (mode === "descriptive_purpose") {
            if (descriptivePurposes.includes(trimTokens(stack).join(''))) {
                mode = "coin"
                descriptivePurpose = trimTokens(stack).join('')
                stack = [token]
                continue
            }
        }
        if (mode === "coin") {
            if (coinMatch(stack)) {
                mode = "coin_quantity"
                coin = trimTokens(stack.map(token => token.replace(/\s+/g, ''))).join('')
                stack = [token]
                continue
            }
        }
        if (mode === "coin_usd") {
            if (token === '🟥') {
                if (isNumericFully(lookAhead())) {
                    lookaheadToken = next()
                    coinUSD = [...stack, lookaheadToken]
                    mode = 'username'
                    endRow()
                    stack = []
                    continue
                }
                else {
                    mode = "username"
                    coinUSD = stack
                    endRow()
                    stack = []
                    continue
                }
            }
        }

        stack.push(token)

        if (mode === "username") {
            const trimmedTokens = trimTokens(stack)
            if (trimmedTokens.length && usernames[trimmedTokens.join('')]) {
                const lookingAhead = isThai(trimmedTokens.join('')) ? lookAhead13() : lookAhead8()
                const addressRedactedIndex = lookingAhead.indexOf('ADDRESS REDACTED')
                if (addressRedactedIndex !== -1) {
                    mode = "address"
                    username = trimTokens([...trimmedTokens, ...lookingAhead.slice(0, addressRedactedIndex)])
                    for (let i = 0; i < addressRedactedIndex; i++) {
                        next()
                    }
                    stack = []
                    continue    
                }
                else {
                    mode = "address"
                    username = trimmedTokens
                    stack = []
                    continue    
                }
            }
        }
    }
    if (mode !== 'username') {
        console.log('mode', mode, pageNum)
    }
    return table
}
// TODO: don't minus 46, just output the page number as in the pdfs

for (let i = 47; i <= 14384; i++) {
    const pageNum = i - 46
    const page = require(`./json-pass-1/coin_transactions_page_${pageNum}.json`);
    const table = reconstruct(page, pageNum)
    fs.writeFile(`./json-pass-2/coin_transactions_${pageNum}.json`, JSON.stringify(table, null, 2), (err) => {
        console.log('processed page ' + pageNum);
    });
}
