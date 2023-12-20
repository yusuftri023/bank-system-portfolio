// unit testing
const base = require("../app/controller/api/v2/accounts");

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};
// get user test
describe("accounts.getAccounts function", () => {
  test("res.json called with accounts data", async () => {
    const req = {
      query: {
        search: "",
      },
    };
    const res = mockResponse();
    await base.getAccounts(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Account search complete",
        data: expect.any(Array),
      })
    );
  });
  test("res.json called with no accounts data", async () => {
    const req = {
      query: {
        page_number: 100,
      },
    };
    const res = mockResponse();
    await base.getAccounts(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Data empty",
      })
    );
  });
});

describe("accounts.getAccountById function", () => {
  test("res.json called with accounts data", async () => {
    const req = {
      params: {
        id: 1,
      },
    };
    const res = mockResponse();
    await base.getAccountById(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Search by id complete",
        data: expect.any(Object),
      })
    );
  });
  test("res.json called with status 404", async () => {
    const req = {
      params: {
        id: 1000000,
      },
    };
    const res = mockResponse();
    await base.getAccountById(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 404,
        message: `Account doesn't exist`,
      })
    );
  });
  test("res.json called with status 400", async () => {
    const req = {
      params: {
        id: "sd",
      },
    };
    const res = mockResponse();
    await base.getAccountById(req, res);
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

describe("accounts.postAccount function", () => {
  test("res.json called with status 201 accounts data", async () => {
    const req = {
      body: {
        identity_number: 5,
        password: "199213sjdfssd",
        email: "henassdasdakkksdsadm@mail.com",
        balance: 20000000,
      },
      query: {},
    };
    const res = mockResponse();
    await base.postAccount(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      status: "success",
      code: 201,
      message: "Account has been created",
      data: expect.any(Object),
    });
  });
  test("res.json called with status 404", async () => {
    const req = {
      body: {
        identity_number: 1,
        password: "199213sjdfd",
        email: "asdsa1112d@gmail.com",
        balance: 20000000,
      },
      query: {
        page_number: 1,
      },
    };
    const res = mockResponse();
    await base.postAccount(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 404,
        message: "User does not exist",
      })
    );
  });
  test("res.json called with status 400", async () => {
    const req = {
      body: {},
      query: {
        page_number: 1,
      },
    };
    const res = mockResponse();
    await base.postAccount(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message: "Bad request : request is not complete ",
      })
    );
  });

  test("res.json called with status 400 accounts email already exist", async () => {
    const req = {
      body: {
        identity_number: "09002100021221111",
        password: "199213sjdfd",
        email: "asdssdsadasdad@sd.com",
        balance: 20000000,
      },
      query: {
        page_number: 1,
      },
    };
    const res = mockResponse();
    await base.postAccount(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      status: "fail",
      code: 400,
      message: "Email already exist",
    });
  });
});

describe("accounts.deleteAccountById function", () => {
  test("res.json called with status 200", async () => {
    const req = {
      params: {
        id: 42,
      },
    };
    const res = mockResponse();
    await base.deleteAccountById(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Account deleted",
        data: expect.any(Object),
      })
    );
  });
  test("res.json called with status 404", async () => {
    const req = {
      params: {
        id: 1000000,
      },
    };
    const res = mockResponse();
    await base.deleteAccountById(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 404,
        message: "Account does not exist",
      })
    );
  });
  test("res.json called with status 400", async () => {
    const req = {
      params: {
        ssad: 1,
      },
    };
    const res = mockResponse();
    await base.deleteAccountById(req, res);
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
