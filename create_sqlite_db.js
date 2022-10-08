const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite3');

db.serialize(() => {
    db.run(`CREATE TABLE transactions (
        username TEXT,
        address TEXT,
        username_address TEXT,
        date TEXT,
        account TEXT,
        type TEXT,
        descriptive_purpose TEXT,
        coin TEXT,
        coin_quantity TEXT,
        coin_usd TEXT
    )`);

    const stmt = db.prepare("INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (let i = 47; i <= 14384; i++) {
        const pageNum = i - 46
        const page = require(`./json-pass-3/coin_transactions_${pageNum}.json`);
        for(let i = 0; i < page.length; i++) {
            const row = page[i]
            stmt.run(row.username, row.address, row.username + row.address, row.date, row.account, row.type, row.descriptive_purpose, row.coin, row.coinQuantity, row.coinUSD);
        }
    }


    stmt.finalize();

    // db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
    //     console.log(row.id + ": " + row.info);
    // });
});

db.close();
