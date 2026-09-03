.PHONY: all install build test start dev clean

all: install build test

install:
	cd backend && npm install
	cd frontend && npm install

build:
	cd frontend && npm run build

test:
	node tests/runner.js

test-e2e:
	node test-e2e-banking.js

start:
	node index.js

clean:
	rm -rf frontend/dist coverage