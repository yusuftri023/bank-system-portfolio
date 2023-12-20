// unit testing
const base = require("../app/controller/api/v2/users");

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};
// get user test
describe("users.getUsers function", () => {
  test("res.json called with users data", async () => {
    const req = { query: {} };
    const res = mockResponse();
    await base.getUsers(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Request has succeeded",
        data: expect.any(Array),
      })
    );
  });
  test("res.json called with no users data", async () => {
    const req = {
      query: {
        page_number: 100,
      },
    };
    const res = mockResponse();
    await base.getUsers(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Data Empty",
      })
    );
  });
});

describe("users.getUsersById function", () => {
  test("res.json called with status 200 and users data", async () => {
    const req = {
      params: {
        id: 5,
      },
    };
    const res = mockResponse();
    await base.getUsersById(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Query successfully displayed",
        data: expect.any(Object),
      })
    );
  });
  test("res.json called with status 200 but with empty data", async () => {
    const req = {
      params: {
        id: 20000,
      },
    };
    const res = mockResponse();
    await base.getUsersById(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "There is no record with that id",
      })
    );
  });
  test("res.json called with status 400", async () => {
    const req = {
      params: {
        id: "iisd",
      },
    };
    const res = mockResponse();
    await base.getUsersById(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message: "Bad Request!",
      })
    );
  });
});

describe("users.postUsers function", () => {
  test("res.json called with status 201", async () => {
    const req = {
      body: {
        user_name: "Hendra Gunsman VI",
        phone_number: "08115548936",
        identity_type: "KTP",
        identity_number: "0900211000271221111",
        address: "Samarinda",
      },
    };
    const res = mockResponse();
    await base.postUsers(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 201,
        message: "User data succesfully added to the database",
        data: expect.any(Object),
      })
    );
  });

  test("res.json called with status 400 Bad request", async () => {
    const req = {
      body: {
        user_name: "Yusuf Trihartono",
        phone_number: "08115548936",
        identity_type: "KTP",

        address: "Samarinda",
      },
    };
    const res = mockResponse();
    await base.postUsers(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message: `Bad request!`,
      })
    );
  });
  test("res.json called with status 409 User data already exist", async () => {
    const req = {
      body: {
        user_name: "Yusuf Trihartono",
        phone_number: "08115548936",
        identity_type: "KTP",
        identity_number: "64123",
        address: "Samarinda",
      },
    };
    const res = mockResponse();
    await base.postUsers(req, res);
    expect(res.status).toBeCalledWith(409);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 409,
        message: expect.any(String),
      })
    );
  });
});

describe("users.deleteUserById function", () => {
  test("res.json called with status 200", async () => {
    const req = {
      params: {
        id: 64,
      },
    };
    const res = mockResponse();
    await base.deleteUserById(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "User has been deleted",
        data: expect.any(Object),
      })
    );
  });
  test("res.json called with status 404", async () => {
    const req = {
      params: {
        id: 31,
      },
    };
    const res = mockResponse();
    await base.deleteUserById(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 404,
        message: "user tidak ada didatabase",
      })
    );
  });
  test("res.json called with status 400", async () => {
    const req = {
      params: {
        id: "sds",
      },
    };
    const res = mockResponse();
    await base.deleteUserById(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message: "Bad request",
      })
    );
  });
});

describe("users.putUsersById function", () => {
  test("res.json called with status 200", async () => {
    const req = {
      params: {
        id: 6,
      },
      body: {
        user_name: "Naruto Uzumaki",
        phone_number: "08115548936",
        identity_type: "KTP",
        identity_number: "64123",
        address: "Samarinda",
      },
    };
    const res = mockResponse();
    await base.putUsersById(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 201,
        message: "User data updated",
        data: expect.any(Object),
      })
    );
  });
  test("res.json called with status 400", async () => {
    const req = {
      params: {
        id: "sdasd",
      },
      body: {
        user_name: "Andsddsdfdaasd",
        phone_number: "08115548936",

        identity_number: "64123121231855232",
        address: "Samarinda",
      },
    };
    const res = mockResponse();
    await base.putUsersById(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 400,
        message:
          "Bad request: request form incomplete or the id is not integer",
      })
    );
  });
  test("res.json called with status 404", async () => {
    const req = {
      params: {
        id: 1000000,
      },
      body: {
        user_name: "Andsddsdfdaasd",
        phone_number: "08115548936",
        identity_type: "KTP",
        identity_number: "64123121231855232",
        address: "Samarinda",
      },
    };
    const res = mockResponse();
    await base.putUsersById(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 404,
        message: "User not found",
      })
    );
  });
  test("res.json called with status 409", async () => {
    const req = {
      params: {
        id: 6,
      },
      body: {
        user_name: "Budi Nugroho",
        phone_number: "08115548936",
        identity_type: "KTP",
        identity_number: "09002100021221111",
        address: "Samarinda",
      },
    };
    const res = mockResponse();
    await base.putUsersById(req, res);
    expect(res.status).toBeCalledWith(409);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "fail",
        code: 409,
        message: expect.any(String),
      })
    );
  });
});
