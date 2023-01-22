# Introduction
Test assignment for Codica 

# Getting started

## Database configuration
- Create DB in you pgAdmin
- configurate (`codica/server/common/dbConfig.ts`)

## Server
- Fetch repository
- Run (`npm install`) then (`npm start`)
- Or using Docker commands

## Bank
(`POST: { name: string }` at `/api/bank/`). The server response return (`{ status: string, bank: object}`).

(`GET: ` at `/api/bank/:id`). The server response return (`{ status: string, bank: object}`). 

(`GET: ` at `/api/bank/`). The server response return (`{ status: string, bank: [object]}`).

(`PATCH: { bank: object }` at `/api/bank/:id`). The server response return (`{ status: string, bank: object}`).

(`DELETE: ` at `/api/bank/:id`). The server response return (`{ status: string, message: string}`).


## Category
(`POST: { name: string, bank: number(bankID) }` at `/api/category/`). The server response return (`{ status: string, category: object}`).

(`GET: ` at `/api/category/:id`). The server response return (`{ status: string, category: object}`). 

(`GET: ` at `/api/category/`). The server response return (`{ status: string, category: [object]}`).

(`PATCH: { category: object }` at `/api/category/:id`). The server response return (`{ status: string, category: object}`).

(`DELETE: ` at `/api/category/:id`). The server response return (`{ status: string, message: string}`).


## Transaction
(`POST: { amount: number, type: string, categories: [number(categoriesIds)] }` at `/api/tranaction/`). The server response return (`{ status: string, transaction: object}`).

(`GET: ` at `/api/transaction/:id`). The server response return (`{ status: string, transaction: object}`). 

(`GET: ` at `/api/transaction/:limit/:page(starting from 0)`). The server response return (`{ status: string, transaction: [object]}`).

(`DELETE: ` at `/api/transaction/:id`). The server response return (`{ status: string, message: string}`).

- After transaction creating server send webhook to specified url.
(`POST: { status: string, message: string, transactionId?: string }` at `specified url`).

### Server Response for failure
The server response form for failure : `{ status: fail, message: string}`.



