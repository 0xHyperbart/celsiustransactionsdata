const fs = require('fs')
const usernames = require('./usernames/usernames.json')
const { isNumericFully } = require('./utils')

const usernamesArray = Object.keys(usernames).map((usernameKey) => {
    return [usernameKey, usernames[usernameKey]]
})

for (let i = 0; i < usernamesArray.length; i++) {
    const [usernameKey, usernameTokens] = usernamesArray[i]
    if (isNumericFully(usernameTokens[0])) {
        delete usernames[usernameKey];
    }
}

delete usernames[""];

delete usernames["0ALEC STEIMEL"];
usernames["ALEC STEIMEL"] = ["ALEC STEIMEL"]

delete usernames[".00CHARLIE VIELMA"];
usernames["CHARLIE VIELMA"] = ["CHARLIE VIELMA"]

delete usernames["00DIDIER FONTAINE"];
usernames["DIDIER FONTAINE"] = ["DIDIER FONTAINE"]

usernames["INVICTUS CAPITAL FINANCIAL TECHNOLOGIES SPC"] = ["INVICTUS CAPITAL FINANCIAL TECHNOLOGIES SPC"]

usernames["RICHARD H. MONTGOMERY III IRREVOCABLE TRUST FBO WILLIAM J. MONTGOMERY U/A/D 8/15/2008 TRU"] = ["RICHARD H. MONTGOMERY III IRREVOCABLE TRUST FBO WILLIAM J. MONTGOMERY U/A/D 8/15/2008 TR", "U"]

usernames["SPRING VALLEY REVOCABLE LIVING TRUST U/A DTD 4/29/1998"] = ["SPRING VALLEY REVOCABLE LIVING TRUST U/A DTD 4/29/1998"]

usernames["STILLAHN-LANG TRUST DTD 02/19/2015"] = ["STILLAHN-LANG TRUST DTD 02/19/2015"]

usernames["THE FRANK TRUST REVOCABLE LIVING TRUST 06/30/2021"] = ["THE FRANK TRUST REVOCABLE LIVING TRUST 06/30/2021"]

usernames["WILLIAM J. MONTGOMERY REVOCABLE TRUST U/A/D 12/16/2011"] = ["WILLIAM J. MONTGOMERY REVOCABLE TRUST U/A/D 12/16/2011"]

fs.writeFile(`./usernames/usernames.json`, JSON.stringify(usernames, null, 2), (err) => {
    console.log('usernames patched');
});
