.PHONY: data test
all: data test

data: 
	node find_usernames.js
	node post_proc_usernames.js
	node reconstruct.js
	node flatten_data.js

test:
	node validate.js



