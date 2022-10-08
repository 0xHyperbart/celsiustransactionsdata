const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sqlite-pass-4/db.sqlite3');

db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run("DROP TABLE IF EXISTS transactions");
    db.run("DROP TABLE IF EXISTS transactions_search");

    db.run(`CREATE TABLE transactions (
        username_address TEXT,
        username TEXT,
        address TEXT,
        date TEXT,
        account TEXT,
        type TEXT,
        descriptive_purpose TEXT,
        coin TEXT,
        coin_quantity TEXT,
        coin_usd TEXT
    )`);
    db.run("COMMIT");

    db.run("BEGIN TRANSACTION");

    for (let i = 47; i <= 14384; i++) {
        const pageNum = i - 46
        const page = require(`./json-pass-3/coin_transactions_${pageNum}.json`);
        for(let i = 0; i < page.length; i++) {
            const row = page[i]
            const {address, date, account, type, descriptivePurpose, coin, coinQuantity} = row
            const username = JSON.stringify(row.username)
            const coinUSD = row.coinUSD || ""
            const username_address = `${row.username.join('')} ${address}`
            db.run(
                `INSERT INTO transactions (
                    username_address,
                    username,
                    address,
                    date,
                    account,
                    type,
                    descriptive_purpose,
                    coin,
                    coin_quantity,
                    coin_usd
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, username_address, username, address, date, account, type, descriptivePurpose, coin, coinQuantity, coinUSD);
        }
    }
    db.run("COMMIT");

    db.run("BEGIN TRANSACTION");
    db.run(`CREATE VIRTUAL TABLE transactions_search USING fts5(
        username_address,
        username,
        address,
        date,
        account,
        type,
        descriptive_purpose,
        coin,
        coin_quantity,
        coin_usd
    );`)
    db.run(
    `INSERT INTO transactions_search(
        username_address,
        username,
        address,
        date,
        account,
        type,
        descriptive_purpose,
        coin,
        coin_quantity,
        coin_usd
    ) SELECT 
        username_address, 
        username, 
        address, 
        date, 
        account, 
        type, 
        descriptive_purpose, 
        coin, 
        coin_quantity, 
        coin_usd 
    FROM transactions;`);
    db.run("COMMIT");

});

db.close();
