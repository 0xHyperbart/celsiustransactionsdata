module.exports.isDate = function isDate(token) {
    const isSingleDate = /\d\d?\/\d\d?\/\d\d\d\d/.test(token)
    const isMultiDate = /\d\d?\/\d\d?\/\d\d\d\d\s+-\s+\d\d?\/\d\d?\/\d\d\d\d/.test(token)
    return isSingleDate || isMultiDate
}
module.exports.isNumeric = function isNumeric(token) {
    return /^(\d|\(|\.)/.test(token)
}
module.exports.isDateish = function isNumeric(token) {
    return /^(\d)/.test(token)
}
module.exports.isDollarSign = function isNumeric(token) {
    return token.includes('$')
}