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

#QA
- Чи використовували ви якісь додаткові бібліотеки? Якщо так, то навіщо?
  - `await-to-js` Async await wrapper for easy error handling
  - `typeorm` ORM framework for refers to the model in your app, refers relationship between tables in RDMS and mapping for bridging the model and tables. 
  - `routing-controllers` framework which allows to create controller classes with methods as actions that handle requests in lightweight way using Decorators.
- Скільки приблизно часу зайняло виконання тестового?
  - About 13-15 hours, taking into account all the issues, reading the documentation if various frameworks and manual testing of API.
- Якби треба було вивести цей проєкт у продакшн, що б ви покращили?
  - Validation of input data and API parameters
  - Authorization/Authentication using JWT + Redis
  - Better and Global error hadnling
  - Using process.env for variables and change settings for build
  - Using Cloud for db like DigitalOcean of AWS
  - Add logger and testing

