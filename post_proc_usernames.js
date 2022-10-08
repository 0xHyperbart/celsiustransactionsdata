const fs = require('fs')
const usernames = require('./usernames/usernames.json')

delete usernames["0ALEC STEIMEL"];
usernames["ALEC STEIMEL"] = ["ALEC STEIMEL"]

delete usernames[".00CHARLIE VIELMA"];
usernames["CHARLIE VIELMA"] = ["CHARLIE VIELMA"]

delete usernames["00DIDIER FONTAINE"];
usernames["DIDIER FONTAINE"] = ["DIDIER FONTAINE"]

usernames["INVICTUS CAPITAL FINANCIAL TECHNOLOGIES SPC"] = ["INVICTUS CAPITAL FINANCIAL TECHNOLOGIES SPC"]

fs.writeFile(`./usernames/usernames.json`, JSON.stringify(usernames, null, 2), (err) => {
    console.log('usernames patched');
});
