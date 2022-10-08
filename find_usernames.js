const fs = require('fs')
const { isDate, isNumeric, isDollarSign } = require('./utils')

function trimTokens(tokens) {
    const tokensCopy = []
    for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        if (token !== '') {
            tokensCopy.push(token)
        }
    }
    return tokensCopy
}

let usernames = {}
let usernamesStats = {}
function addUsername(usernameTokens) {
    const trimmedTokens = trimTokens(usernameTokens)
    const usernameKey = trimmedTokens.join('')
    usernames[usernameKey] = usernames[usernameKey] || new Set([])
    usernames[usernameKey].add(JSON.stringify(trimmedTokens))
    usernamesStats[usernameKey] = usernames[usernameKey].size
}

function reconstructUsernames(page, pdfNum) {
    const contPage = page.flat()
    let isLastTokenAMark = false
    let firstTokenAfterMark = ""
    let stack = []
    for(let i = 0; i < contPage.length; i++) {
        const token = contPage[i]
        if (i === 0) {
            addUsername([token])
        }
        else {
            if (isLastTokenAMark) {
                if (firstTokenAfterMark === "") {
                    firstTokenAfterMark = token
                }
                if (token === "ADDRESS REDACTED") {
                    addUsername(stack)
                    stack = []
                    isLastTokenAMark = false
                    continue
                }

                if (token === "🟥") {
                    if (
                        // TODO: the ad-hoc list here is not ideal, it may lead to missing usernames
                        firstTokenAfterMark !== "Earn - Interest; Earn, Custody or Withheld - Rewards" &&
                        firstTokenAfterMark !== "rest and Rewards" &&
                        firstTokenAfterMark !== "Interest and Rewards" &&
                        firstTokenAfterMark !== " Custody or Withheld - Rewards" &&
                        firstTokenAfterMark !== "20" && // TODO: double check this username is not missing
                        firstTokenAfterMark !== "796.73" && // TODO: double check this username is not missing
                        !isDate(firstTokenAfterMark) && 
                        !isDollarSign(firstTokenAfterMark) &&
                        stack[1] !== 'Interest and Rewards' &&
                        !isDate(stack[1]) &&
                         // TODO: double check these username is not missing
                        stack[1] !== 'ALLEN AVENUE, ST. LOUIS, MISSOURI 63119' &&
                        stack[1] !== '67 FORT STREET, GRAND CAYMAN, KY1-1102 CAYMAN ISLANDS'
                    ) {
                        if (
                            // FYI: the list bellow is ok, we're just checking for companies which have physical address
                            firstTokenAfterMark !== 'AYKAN SEVINC' && 
                            firstTokenAfterMark !== 'KFV VINC' && 
                            firstTokenAfterMark !== 'LAM M.D., P.C.' && 
                            firstTokenAfterMark !== 'LETICIA GERALDINE CONCEPCION GINI AREVALOS' && 
                            firstTokenAfterMark !== 'MOSHE TEST PRODUCTION TEST' && 
                            firstTokenAfterMark !== 'PC LALRINMUANA' && 
                            firstTokenAfterMark !== 'TRAVEL TO EARTH' && 
                            firstTokenAfterMark !== 'TRUST AKPOBOME' && 
                            firstTokenAfterMark !== 'UNLIMITED NOBLE' && 
                            !firstTokenAfterMark.includes('CARDIOSYSTEMS') && 
                            !firstTokenAfterMark.includes('CORPOTENO') && 
                            !firstTokenAfterMark.includes(' INSTITUTE') && 
                            !firstTokenAfterMark.includes(' CAPITAL') && 
                            !firstTokenAfterMark.includes(' SRL') && 
                            !firstTokenAfterMark.includes(' SARL') && 
                            !firstTokenAfterMark.includes(' SOLUTIONS') && 
                            !firstTokenAfterMark.includes(' BENEFITSOLUTIONS') && 
                            !firstTokenAfterMark.includes(' INVESTMENTS') && 
                            !firstTokenAfterMark.includes(' CONSULTING') && 
                            !firstTokenAfterMark.includes(' MANAGEMENT') && 
                            !firstTokenAfterMark.includes(' CONSTRUCTION') && 
                            !firstTokenAfterMark.includes(' MARKETING') && 
                            !firstTokenAfterMark.includes(' CHIROPRACTIC') && 
                            !firstTokenAfterMark.includes(' CARE') && 
                            !firstTokenAfterMark.includes(' FILM') && 
                            !firstTokenAfterMark.includes(' VENTURES') && 
                            !firstTokenAfterMark.includes(' AB') && 
                            !firstTokenAfterMark.includes(' AG') && 
                            !firstTokenAfterMark.includes(' SUPERFUND') && 
                            !firstTokenAfterMark.includes(' B.V.') && 
                            !firstTokenAfterMark.includes(' TECHNOLOGIES') && 
                            !firstTokenAfterMark.includes(' 401K') && 
                            !firstTokenAfterMark.includes(' S401K') && 
                            !firstTokenAfterMark.includes(' PLLC') && 
                            !firstTokenAfterMark.includes(' PROPERTIES') && 
                            !firstTokenAfterMark.includes(' GMBH') && 
                            !firstTokenAfterMark.includes(' LABS') && 
                            !firstTokenAfterMark.includes(' LLP') && 
                            !firstTokenAfterMark.includes(' L.L.C.') && 
                            !firstTokenAfterMark.includes(' CORP') && 
                            !firstTokenAfterMark.includes(' SPC') && 
                            !firstTokenAfterMark.includes(' TRUST') && 
                            !firstTokenAfterMark.includes(' LIMITED') && 
                            !firstTokenAfterMark.includes(' HOLDINGS') && 
                            !firstTokenAfterMark.includes(' LP') && 
                            !firstTokenAfterMark.includes(' FZ-LLC') && 
                            !firstTokenAfterMark.includes(' LTD') && 
                            !firstTokenAfterMark.includes(' CO.') && 
                            !firstTokenAfterMark.includes(' S.R.O.') && 
                            !firstTokenAfterMark.includes(' COMPANY') && 
                            !firstTokenAfterMark.includes(' FUND') && 
                            !firstTokenAfterMark.includes(' INC') &&
                            !firstTokenAfterMark.includes(' LLC')) {

                            if (contPage[i + 1] === "ADDRESS REDACTED" || contPage[i + 1] === "🟥") {
                                addUsername([...stack])
                                stack = []
                                isLastTokenAMark = false   
                                continue
                            }
                            if (contPage[i + 2] === "ADDRESS REDACTED" || contPage[i + 2] === "🟥") {
                                addUsername([...stack, contPage[i + 1]])
                                stack = []
                                isLastTokenAMark = false   
                                continue
                            }
                            if (contPage[i + 3] === "ADDRESS REDACTED" || contPage[i + 3] === "🟥") {
                                addUsername([...stack, contPage[i + 1], contPage[i + 2]])
                                stack = []
                                isLastTokenAMark = false   
                                continue
                            }
                            if (contPage[i + 4] === "ADDRESS REDACTED" || contPage[i + 4] === "🟥") {
                                addUsername([...stack, contPage[i + 1], contPage[i + 2], contPage[i + 3]])
                                stack = []
                                isLastTokenAMark = false   
                                continue
                            }
                            if (contPage[i + 5] === "ADDRESS REDACTED" && stack[0] === "01" && stack[1] === '') {
                                // special case for ANTONIO BRA Č I Ć
                                addUsername([contPage[i + 1], contPage[i + 2], contPage[i + 3], contPage[i + 4]])
                                stack = []
                                isLastTokenAMark = false
                                continue
                            }
                            console.log('unusual username', stack, pdfNum, contPage[i + 1], contPage[i + 2], contPage[i + 3], contPage[i + 4], contPage[i + 5])
                        }
                        else {
                            addUsername([firstTokenAfterMark])
                        }
                    }
                    stack = []
                    isLastTokenAMark = true
                    firstTokenAfterMark = ""
                    continue
                }
                stack.push(token)
            }
            else {
                isLastTokenAMark = token === '🟥'
                firstTokenAfterMark = ""
            }
        }
    }
}

for (let i = 47; i <= 14384; i++) {
    const pageNum = i - 46
    const page = require(`./json-pass-1/coin_transactions_page_${pageNum}.json`);
    reconstructUsernames(page, i)
}

let sortable = [];
for (let usernameKey in usernames) {
    sortable.push([usernameKey, usernames[usernameKey]]);
}

sortable.sort((a, b) => {
    return b[1].size - a[1].size;
});

const mixedTokenizationUsernames = sortable.filter(x => x[1].size > 1)
if (mixedTokenizationUsernames.length > 0) {
    console.log('mixedTokenizationUsernames', mixedTokenizationUsernames)
    throw new Error('Tokenization left some usernames which have different tokenizations')
}

sortable.sort((a, b) => {
    return b[0].length - a[0].length;
});

const output = {}
for (let usernameKey in usernames) {
    output[usernameKey] = JSON.parse([...usernames[usernameKey]][0])
}

fs.writeFile(`./usernames/usernames.json`, JSON.stringify(output, null, 2), (err) => {
    console.log('usernames extracted');
});
