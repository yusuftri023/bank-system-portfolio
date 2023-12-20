const request = require("supertest");
const app = require("../index");

describe("GET /api/v2/users", () => {
  it("Return status : 200 and Users data", async () => {
    const res = await request(app).get("/api/v2/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("code");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toEqual(expect.any(Array));
  });
  it("Return status : 200 with no Users data", async () => {
    const res = await request(app).get("/api/v2/users");
    expect(res.statusCode).toBe(200);
    // expect(res.body).toHaveProperty('status')
    // expect(res.body).toHaveProperty('code')
    // expect(res.body).toHaveProperty('message')
    // expect(res.body).toHaveProperty('data')
    expect(res.body.data).toEqual(expect.any(Array));
  });
});

// app.get('/api/v2/users', controller.usersV2.getUsers)
// app.get('/api/v2/users/:id', controller.usersV2.getUsersById)
// app.post('/api/v2/users', controller.usersV2.postUsers)
// app.delete('/api/v2/users/:id', controller.usersV2.deleteUserById)
// app.put('/api/v2/users/:id', controller.usersV2.putUsersById)

// app.get('/api/v2/accounts', controller.accountsV2.getAccounts )
// app.get('/api/v2/accounts/:id', controller.accountsV2.getAccountById)
// app.post('/api/v2/accounts', controller.accountsV2.postAccount)
// app.delete('/api/v2/accounts/:id', controller.accountsV2.deleteAccountById )

// // transfer transaction
// app.post('/api/v2/transactions', controller.transactionsV2.postTransactions)
// // get all transactions data in database with pagination and search features
// app.get('/api/v2/transactions', controller.transactionsV2.getTransactions)
// // get the details of account all transactions in bank
// app.get('/api/v2/transactions/:id', controller.transactionsV2.getTransactionByAccountId)
// app.delete('/api/v2/transactions/:id', controller.transactionsV2.deleteTransactionById)
