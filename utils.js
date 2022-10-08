module.exports.isDate = function isDate(token) {
    const isSingleDate = /\d\d?\/\d\d?\/\d\d\d\d/.test(token)
    const isMultiDate = /\d\d?\/\d\d?\/\d\d\d\d\s+-\s+\d\d?\/\d\d?\/\d\d\d\d/.test(token)
    return isSingleDate || isMultiDate
}
module.exports.isNumeric = function isNumeric(token) {
    return /^(\d|\(|\.)/.test(token)
}
module.exports.isNumericFully = function isNumeric(token) {
    return /^[\d\(\.]+$/.test(token)
}
module.exports.isDateish = function isNumeric(token) {
    return /^\d\d?\/?\d?\d?$/.test(token)
}
module.exports.isDollarSign = function isNumeric(token) {
    return token.includes('$')
}

module.exports.trimTokens = function trimTokens(tokens) {
    const tokensCopy = []
    for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        if (token !== '' && token !== '🟥') {
            tokensCopy.push(token)
        }
    }
    return tokensCopy
}