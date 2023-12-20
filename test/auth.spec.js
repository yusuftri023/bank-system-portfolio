const base = require("./../app/controller/api/v2/auth");

const mockResponse = () => {
  const res = {};
  res.redirect = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};
const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

describe("auth.registerNewAccount function untuk token based authentication", () => {
  test("register form : email berhasil didaftar  ", async () => {
    const req = {
      body: {
        user_id: 5,
        email: "12321ssjas3111sam@gmail.com",
        password: " asdasdsdsad",
        balance: 100000000,
      },
    };
    const res = mockResponse();
    await base.registerNewAccount(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      status: "success",
      code: 201,
      message: "Account has been created",
      data: expect.any(Object),
    });
  });

  test("register form : user does not exist  ", async () => {
    const req = {
      body: {
        user_id: 1,
        email: "sdsa1ssssdm@m2sm.com",
        password: " asdasdsdsad",
        balance: 100000000,
      },
    };
    const res = mockResponse();
    await base.registerNewAccount(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      status: "fail",
      code: 404,
      message: "User does not exist",
    });
  });
  test("register form : user does not exist  ", async () => {
    const req = {
      body: {
        user_id: 1,
        email: "sdsa1ssssdm@m2sm.com",
        password: " asdasdsdsad",
      },
    };
    const res = mockResponse();
    await base.registerNewAccount(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      status: "fail",
      code: 400,
      message: "Bad request : request is not complete ",
    });
  });
});

describe("auth.loginAccount function fitur login token based", () => {
  test("login form : login gagal  ", async () => {
    const req = {
      body: {
        email: "jam@gmail.com",
        password: " asdasdsdsad",
      },
    };
    const res = mockResponse();
    await base.loginAccount(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      status: "fail",
      code: 400,
      message: "Login gagal",
    });
  });

  test("login form : berhasil login  ", async () => {
    const req = {
      body: {
        email: "yusufhaha@gmail.com",
        password: "12345678",
      },
    };
    const res = mockResponse();
    await base.loginAccount(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      status: "success",
      code: 201,
      message: "Login success",
      data: expect.any(Object),
    });
  });
});

describe("auth.whoami function", () => {
  test("menampilkan hasil pengecekan authorization token", async () => {
    const req = {
      user: {
        account_id: 25,
        account_number: 25,
        balance: "-150000",
        user_id: 5,
        email: "yusufhaha@gmail.com",
        createAt: "2023-11-06T19:44:06.000Z",
        updatedAt: "2023-11-06T17:55:42.430Z",
        iat: 1699349419,
        exp: 1699353019,
      },
    };
    const res = mockResponse();
    await base.whoami(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      status: "success",
      message: "OK",
      data: {
        user: expect.any(Object),
      },
    });
  });
});

describe("auth.authUser function/callback pada validasi session based ", () => {
  test("validasi login berhasil  ", async () => {
    const email = "yusufhaha@gmail.com";
    const password = "12345678";
    const res = mockResponse();
    const done = jest.fn();
    await base.authUser(email, password, done);
    expect(done).toBeCalledWith(null, expect.any(Object));
  });
  test("validasi login gagal email/password salah  ", async () => {
    const email = "yusufhaha@gmail.com";
    const password = "1234678";
    const res = mockResponse();
    const done = jest.fn();
    await base.authUser(email, password, done);
    expect(done).toBeCalledWith(null, false, {
      message: "Invalid email or password",
    });
  });
  test("validasi login error  ", async () => {
    const email = "yusufhaha@gmail.com";
    const password = 1;
    const res = mockResponse();
    const done = jest.fn();
    await base.authUser(email, password, done);
    expect(done).toBeCalledWith(null, false, { message: expect.any(String) });
  });
});

describe("auth.dashboard function", () => {
  test("menampilkan dashboard yang berisi data akun pengguna", async () => {
    const req = {
      user: {
        account_id: 25,
        account_number: 25,
        balance: 1000000,
        user_id: 5,
        email: "yusufhaha@gmail.com",
        createAt: "2023-11-06T19:44:06.000Z",
        updatedAt: "2023-11-06T17:55:42.430Z",
      },
    };
    const res = mockResponse();
    res.render = jest.fn().mockReturnValue(res);
    await base.dashboard(req, res);
    expect(res.render).toBeCalledWith("dashboard", { user: req.user });
  });
});

describe("auth.registerForm function", () => {
  test("menampilkan dashboard yang berisi data akun pengguna", async () => {
    const req = {
      body: {
        email: "jjaakkksssdw15adsabvl@mmm.com",
        password: "jajajkks",
        user_id: 5,
      },
    };
    const res = mockResponse();
    const next = jest.fn();
    req.flash = jest.fn();
    await base.registerForm(req, res, next);
    expect(req.flash).toBeCalledWith("success", "Email berhasil didaftar!");
    expect(res.redirect).toBeCalledWith("/api/v2/auth/login");
  });
  test("menampilkan dashboard yang berisi data akun pengguna", async () => {
    const req = {
      body: {
        email: "jjaakkksssdsadl@mmm.com",
        password: "jajajkks",
        user_id: 5,
      },
    };
    const res = mockResponse();
    const next = jest.fn();
    req.flash = jest.fn();
    await base.registerForm(req, res, next);
    expect(req.flash).toBeCalledWith("error", "Email sudah terdaftar!");
    expect(res.redirect).toBeCalledWith("/api/v2/auth/register");
  });
});
