const fs = require('fs')
const usernames = require('./usernames/usernames.json')

delete usernames["0ALEC STEIMEL"];
usernames["ALEC STEIMEL"] = ["ALEC STEIMEL"]

fs.writeFile(`./usernames/usernames.json`, JSON.stringify(usernames, null, 2), (err) => {
    console.log('usernames patched');
});
