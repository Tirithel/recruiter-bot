ci: build test

build:
	npx projen build

run:
	node lib/index.js

test:
	npx projen test
	

