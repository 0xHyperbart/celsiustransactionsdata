const fs = require('fs')
const usernamesLeft = {...require('./usernames/usernames.json')}
const usernamesCopy = {...require('./usernames/usernames.json')}
const { eqSet } = require('./utils')

const multiAddresses = new Set([])
const singleAddresses = new Set([])
const usedAccounts = new Set([])

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

function validateCoinUsd(page) {
    // validate all fields are filled out (not null) (apart from coinUSD)
    for(let i = 0; i < page.length; i++) {
        const row = page[i]
        // TODO: if row.coinUSD is [], set it to null
        const coinUSD = row.coinUSD ? row.coinUSD.join('') : null
        if (coinUSD) {
            const dollarMatch = coinUSD.match(/^\(?\$[\d\,]+\.\d\d\)?$/)
            if (!dollarMatch) {
                console.log('coinUSD',coinUSD, row.coinUSD)
                return false
            }
        }
    }
    return true
}

function validateOutgoing(page) {
    for(let i = 0; i < page.length; i++) {
        const row = page[i]
        const coinQuantity = row.coinQuantity.join('')
        // TODO: if row.coinUSD is [], set it to null
        const coinUSD = row.coinUSD ? row.coinUSD.join('') : null
        if (row.type === 'Outgoing') {
            if (!coinQuantity.match(/^\([\d\.\,]+\)$/) && coinQuantity !== '0.0') {
                console.log('Outgoing coinQuantity',coinQuantity)
                return false
            }
            if (coinUSD) {
                if (!coinUSD.match(/^\(\$[\d\,]+\.\d\d\)$/) && coinUSD !== '$0.00') {
                    console.log('Outgoing coinUSD',coinUSD)
                    return false
                }    
            }
        }
        else if (row.type === 'Incoming') {
            if (!coinQuantity.match(/^[\d\.\,]+$/)) {
                console.log('Incoming coinQuantity',coinQuantity)
                return false
            }
            if (coinUSD) {
                if (!coinUSD.match(/^\$[\d\,]+\.\d\d$/)) {
                    console.log('Incoming coinUSD',coinUSD)
                    return false
                }    
            }
        }
    }
    return true
}


for (let i = 47; i <= 14384; i++) {
    const pageNum = i - 46
    const page = require(`./json-pass-2/coin_transactions_${pageNum}.json`);

    // validate that we're using all usernames
    for(let i = 0; i < page.length; i++) {
        const row = page[i]
        const username = row.username
        delete usernamesLeft[username.join('')]
    }

    // validate that addresses from multiple tokens are ok
    for(let i = 0; i < page.length; i++) {
        const row = page[i]
        if (row.address.length > 1) {
            if (!row.address.join('').match(/^\d+/)) {
                multiAddresses.add(row.address.join(''))
            }
        }
        else {
            singleAddresses.add(row.address.join(''))
        }
    }

    // validate that accounts are not too variant
    for(let i = 0; i < page.length; i++) {
        const row = page[i]
        usedAccounts.add(row.account)
    }

    // validate dates
    // validate accounts are not too variant
    // validate types are not too variant
    // validate descriptive purposes are not too variant
    // validate coins are not too variant
    // validate that coin quantity is parsable

    if (!validatePageRowCount(page, i)) {
        throw new Error(`Page ${pageNum} doesn't have the right number of rows, but instead ${page.length}`)
    }

    if (!validateFieldsNotNull(page)) {
        throw new Error(`Page ${pageNum} doesn't have all fields filled out.`)
    }

    if (!validateCoinUsd(page)) {
        throw new Error(`Page ${pageNum} doesn't have the right coin USD values.`)
    }

    if (!validateOutgoing(page)) {
        throw new Error(`Page ${pageNum} doesn't have the amounts that correspond to type.`)
    }

}

// validate users left
const usernamesLeftArray = Object.keys(usernamesLeft).map((usernameKey) => {
    return [usernameKey, usernamesLeft[usernameKey]]
})
const usernamesArray = Object.keys(usernamesCopy).map((usernameKey) => {
    return [usernameKey, usernamesCopy[usernameKey]]
})

for (let i = 0; i < usernamesLeftArray.length; i++) {
    const [usernameKey, usernameTokens] = usernamesLeftArray[i]
    const betterUsername = usernamesArray.find(([usernameKey2, usernameTokens2]) => {
        for (var j = 0; j < usernameTokens.length; j++) {
            if (usernameTokens2[j] !== usernameTokens[j]) {
                return false
            }
        }
        return usernameKey2 !== usernameKey
    })
    if (betterUsername) {
        delete usernamesLeft[usernameKey]
    }
}

delete usernamesLeft['FAHRETTIN '] // checked, matched ok
delete usernamesLeft["MATIJA KAZIMIROVI"] // checked, matched ok
delete usernamesLeft["KAROL MIESZA"] // checked, matched ok
delete usernamesLeft["MIKS VASI"] // checked, matched ok
delete usernamesLeft["QUÂN TR"] // checked, matched ok
delete usernamesLeft["TOMÁŠ HLA"] // checked, matched ok

delete usernamesLeft['กนกกาญจน์โฆสิ'] // checked, matched ok
delete usernamesLeft['ตโภคะ'] // checked, part of the name above
delete usernamesLeft['ชั'] // checked, matched ok
delete usernamesLeft['ชวาลย์นามนาเมือง'] // checked, part of the name above
delete usernamesLeft['สั'] // checked, matched ok
delete usernamesLeft['กรินทร์เชษฐศาสน์'] // checked, part of the name above

if (Object.keys(usernamesLeft).length > 0) {
    throw new Error(`Usernames left: ${JSON.stringify(usernamesLeft)}`)
}

// validate multi addresses
multiAddresses.delete("MARICORP SERVICES LTD. 31 THE STRAND 46 CANAL POINT DRIVE, GEORGE TOWN, GRAND CAYMAN, K")
multiAddresses.delete("CORE BUSINESS ACCOUNTANTS PTY LTD, 'K1' U 11, 16 INNOVATION PARKWAY,, BIRTINYA , 4575 AUSTRA")
multiAddresses.delete("GLENARM CRESCENT, KILLARNEY HEIGHTS, 2087 AUSTRALIA")
multiAddresses.delete("MARKET STREET, 758 CAMANA BAY, GRAND CAYMAN, KY1-9006 CAYMAN ISLANDS")
multiAddresses.delete("N LOMBARD AVΕ, LOMBARD , ILLINOIS 60148")
multiAddresses.delete('SCARRS RD, GARDEN ISLAND CREEK, TASMANIA , 7112 AUSTRALIA4/14/2')
multiAddresses.delete('MAPLES CORPORATE SERVICES LIMITED,UGLAND HOUSE, GRAND CAYMAN, KY1-1104 CAYMAN ISLANDS')
multiAddresses.delete('CAYE FINANCIAL CENTRE, COR. COCONUT DR. & HURRICANE WAY, , SAN PEDRO TOWN, AMBERGRIS CA')
multiAddresses.delete('ROOM 1001, 10/F, TOWER B, NEW MANDARIN PLAZA, 14 SCIENCE MUSEUM ROAD, HONG KONG, HONG K')
multiAddresses.delete('SUITE 214, 396 SCARBOROUGH BEACH ROAD, OSBORNE PARK, WESTERN AUSTRALIA, 6017 AUSTRALIA')
if (multiAddresses.size > 0) {
    throw new Error(`Multi addresses left: ${JSON.stringify([...multiAddresses])}`)
}

// console.log('singleAddresses',singleAddresses)

// validate accounts
if (!eqSet(usedAccounts, new Set(accounts))) {
    throw new Error(`Accounts don't match`)
}