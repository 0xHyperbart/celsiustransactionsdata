.PHONY: data test
all: data test

data: 
	node find_usernames.js
	node post_proc_usernames.js
	node reconstruct.js

test:
	node validate.js



