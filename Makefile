.PHONY: data test
all: data test

data: 
	node clean_coin_txs_pass_1.js
	node find_usernames.js
	node post_proc_usernames.js
	node reconstruct.js
	node flatten_data.js
	node create_sqlite_db.js

test:
	node validate.js



