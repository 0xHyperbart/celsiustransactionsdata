function isDate(token) {
    const isSingleDate = /\d\d?\/\d\d?\/\d\d\d\d/.test(token)
    const isMultiDate = /\d\d?\/\d\d?\/\d\d\d\d\s+-\s+\d\d?\/\d\d?\/\d\d\d\d/.test(token)
    return isSingleDate || isMultiDate
}

// Accounts:
// "Earn - Interest; Earn, Custody or Withheld - Rewards"
// "Earn"
// "Custody"
// "EarnIncoming"
// "EarnOutgoing"
// "Withheld"

// Descriptive Purpose:
// "Collateral"
// "Deposit"
// "Inbound Transfer"
// "Interest"? - not a thing
// "Interest and Rewards"
// "Internal"? - not a thing
// "Internal Account"? - not a thing
// "Internal Account Transfer"
// "Loan Interest"? - not a thing
// "Loan Interest Liquidation"
// "Loan Interest Payment"
// "Loan Principal"? - not a thing
// "Loan Principal Liquidation"
// "Loan Principal Payment"
// "Operation Cost"
// "Outbound Transfer"
// "Swap In"
// "Swap Out"
// "Withdrawal"

let theSet = new Set([]);
function reconstruct(page) {
    const continuousPage = page.flat()

    let isLastTokenAMark = false
    for(let i = 0; i < continuousPage.length; i++) {
        const token = continuousPage[i]
        if (isLastTokenAMark) {
            if (token.length <= 4) {
                theSet.add(token + continuousPage[i + 1])
            }
            else {
                theSet.add(token)
            }
        }
        isLastTokenAMark = isDate(token)
    }
}

for (let i = 47; i <= 14384; i++) {
    const pageNum = i - 46
    const page = require(`./json-pass-1/coin_transactions_page_${pageNum}.json`);
    reconstruct(page)
    console.log('processed page ' + pageNum);
}
console.log('theSet',[...theSet].sort())

