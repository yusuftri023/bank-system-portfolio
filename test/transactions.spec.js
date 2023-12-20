// unit testing
const base = require("../app/controller/api/v2/transactions");

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};
describe("transactions.postTransfer function", () => {
  test("res.json called with 201 and receipt of transaction", async () => {
    const req = {
      body: {
        norek_penerima: 3,
        amount: 100000,
      },
      user: {
        account_number: 1,
      },
    };
    const res = mockResponse();
    await base.postTransfer(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 201,
        message: "Transaction complete",
        data: expect.any(Object),
      })
    );
  });
  test("res.json called with status 400 ", async () => {
    const req = {
      body: {
        norek_penerima: 3,
        amount: 100000,
      },
      user: {
        account_number: 3,
      },
    };
    const res = mockResponse();
    await base.postTransfer(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message: "Bad request : tidak bisa mentransfer ke akun sendiri",
      })
    );
  });
  test("res.json called with status 404 ", async () => {
    const req = {
      body: {
        norek_penerima: 2,
        amount: 100000,
      },
      user: {
        account_number: 1,
      },
    };
    const res = mockResponse();
    await base.postTransfer(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 404,
        message: "Account does not exist",
      })
    );
  });
  test("res.json called with status 500 ", async () => {
    const req = {
      body: {
        email_pengirim: "hsadou@jfdiidf.com",
        email_penerima: "hsadou@jfdiidf.ascom",
        amount: 1000000000000,
      },
    };
    const res = mockResponse();
    await base.postTransfer(req, res);
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 500,
        message: "Internal Server Error",
      })
    );
  });
});
describe("transactions.Withdraw function", () => {
  test("res.json called with 201 and receipt of transaction", async () => {
    const req = {
      body: {
        amount: 100000,
      },
      params: {
        account_number: 1,
      },
    };
    const res = mockResponse();
    await base.postWithdraw(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 201,
        message: "Transaction complete",
        data: expect.any(Object),
      })
    );
  });
  test("res.json called with status 400 ", async () => {
    const req = {
      body: {
        amount: -100000,
      },
      params: {
        account_number: 3,
      },
    };
    const res = mockResponse();
    await base.postWithdraw(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message: "Bad request ",
      })
    );
  });
  test("res.json called with status 404 ", async () => {
    const req = {
      body: {
        amount: 100000,
      },
      params: {
        account_number: 2,
      },
    };
    const res = mockResponse();
    await base.postWithdraw(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 404,
        message: "Account does not exist",
      })
    );
  });
  test("res.json called with status 500 ", async () => {
    const req = {
      body: {
        amount: 1111111111111111,
      },
      params: {
        account_number: 1,
      },
      query: {},
    };
    const res = mockResponse();
    await base.postWithdraw(req, res);
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 500,
        message: "Internal Server Error",
      })
    );
  });
});
describe("transactions.postDeposit function", () => {
  test("res.json called with 201 and receipt of transaction", async () => {
    const req = {
      body: {
        amount: 100000,
      },
      params: {
        account_number: 1,
      },
    };
    const res = mockResponse();
    await base.postDeposit(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 201,
        message: "Transaction complete",
        data: expect.any(Object),
      })
    );
  });
  test("res.json called with status 400 ", async () => {
    const req = {
      body: {
        amount: -99,
      },
      params: {
        account_number: 3,
      },
    };
    const res = mockResponse();
    await base.postDeposit(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message: "Bad request ",
      })
    );
  });
  test("res.json called with status 404 ", async () => {
    const req = {
      body: {
        amount: 100000,
      },
      params: {
        account_number: 11111111,
      },
    };
    const res = mockResponse();
    await base.postDeposit(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 404,
        message: "Account does not exist",
      })
    );
  });
  test("res.json called with status 500 ", async () => {
    const req = {
      body: {
        amount: 1111111111111111,
      },
      params: {
        account_number: 1,
      },
      query: {},
    };
    const res = mockResponse();
    await base.postDeposit(req, res);
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 500,
        message: "Internal Server Error",
      })
    );
  });
});

// get transactions
describe("transactions.getTransactions function", () => {
  test("res.json called with 200 and lists of transactions in database", async () => {
    const req = {
      query: {
        page_number: 1000,
        display_limit: 10,
        search_amount: 100,
      },
    };
    const res = mockResponse();
    await base.getTransactions(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Data empty",
      })
    );
  });
  test("res.json called with no users data", async () => {
    const req = {
      query: {
        page_number: 1,
        display_limit: 10,
        search_amount: 100,
      },
    };
    const res = mockResponse();
    await base.getTransactions(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Request has succeeded",
        data: expect.any(Object),
      })
    );
  });
});

describe("transactions.getTransactionByAccountId function", () => {
  test("res.json called with 200 and lists of transactions in database", async () => {
    const req = {
      params: {
        account_number: 2,
      },
      query: {},
    };
    const res = mockResponse();
    await base.getTransactionByAccountId(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Transaction list is empty",
      })
    );
  });

  test("res.json called with no account data", async () => {
    const req = {
      params: {
        account_number: 3,
      },
      query: {},
    };
    const res = mockResponse();
    await base.getTransactionByAccountId(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Query successfully displayed",
        data: expect.any(Array),
      })
    );
  });
  test("res.json called with status 400", async () => {
    const req = {
      params: {},
    };
    const res = mockResponse();
    await base.getTransactionByAccountId(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message: "Bad Request! id required and need to be a number",
      })
    );
  });
});

describe("transactions.deleteTransactionById function", () => {
  test("res.json called with status 400 ", async () => {
    const req = {
      params: {},
    };
    const res = mockResponse();
    await base.deleteTransactionById(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message: "Bad request: id field required",
      })
    );
  });

  test("res.json called with status 200 (delete transaction record)", async () => {
    const req = {
      params: {
        id: 29,
      },
    };
    const res = mockResponse();
    await base.deleteTransactionById(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Transaction has been deleted",
        data: expect.any(Object),
      })
    );
  });
  test("res.json called with status 400", async () => {
    const req = {
      params: {
        id: 1000000,
      },
    };
    const res = mockResponse();
    await base.deleteTransactionById(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 404,
        message: "Data not found",
      })
    );
  });
});
