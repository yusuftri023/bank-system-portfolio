const model = require("./../../../model/v3/accounts");
const auth = require("./../../../../utils/auth");
const { PrismaClient } = require("@prisma/client");
const { JWTsign, JWTresetpassword } = require("../../../../utils/jwt");
const {
  sendMailActivation,
  sendMailResetPassword,
} = require("../../../../utils/nodemailer");
const prisma = new PrismaClient();

module.exports = {
  async registerNewAccount(req, res, next) {
    try {
      const { email, password, user_id } = req.body;
      if (!email || !password || !+user_id) {
        return res.status(400).json({
          status: "fail",
          code: 400,
          message: "Bad request : request is not complete ",
        });
      }
      const search_id = await model.searchUserId(+user_id);
      if (!search_id) {
        return res.status(404).json({
          status: "fail",
          code: 404,
          message: "User does not exist",
        });
      }
      let hashed_password = await auth.hashPassword(password);
      const result = await model.createNewAccount(
        email,
        +user_id,
        hashed_password
      );
      if (result) {
        await sendMailActivation(`Thank you for signing up`, result.email);
        next();
      }
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: "Internal Error: " + error,
      });
    }
  },
  async loginAccount(req, res) {
    const { email, password } = req.body;
    const accountData = await prisma.accounts.findFirst({
      where: {
        email: email,
      },
    });
    if (!accountData) {
      return res.status(404).json({
        status: "fail",
        code: 404,
        message: "Account does not exist",
      });
    }

    const isCorrect = await auth.checkPassword(password, accountData.password);

    if (!isCorrect) {
      return res.status(400).json({
        status: "fail",
        code: 400,
        message: "Login gagal",
      });
    }
    if (isCorrect) {
      delete accountData.password;
      const token = await JWTsign(accountData);
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
        })
        .status(201)
        .json({
          status: "success",
          code: 201,
          message: "Login success",
          data: { accountData, token },
        });
    }
  },
  async whoami(req, res) {
    return res.status(200).json({
      status: "success",
      message: "OK",
      data: {
        user: req.user,
      },
    });
  },
  async logoutAccount(req, res) {
    return res.clearCookie("access_token").status(200).json({
      status: "success",
      message: "You're now logged out",
    });
  },
  async registerForm(req, res, next) {
    try {
      const { email, password, user_id } = req.body;
      const user = await prisma.accounts.findFirst({
        where: {
          email,
        },
      });
      if (user) {
        req.flash("error", "Email sudah terdaftar!");
        return res.redirect("/register");
      }
      const createUser = await prisma.accounts.create({
        data: {
          email,
          user_id: +user_id,
          password: await auth.hashPassword(password),
        },
      });

      return res.redirect("/api/v3/auth/login");
    } catch (error) {
      next(error);
    }
  },
  authUser: async (email, password, done) => {
    try {
      const user = await prisma.accounts.findUnique({
        where: { email },
      });
      if (!user || !(await auth.checkPassword(password, user.password))) {
        return done(null, false, { message: "Invalid email or password" });
      }
      return done(null, user);
    } catch (error) {
      return done(null, false, { message: error.message });
    }
  },
  dashboard: async (req, res, next) => {
    res.render("dashboard", { user: req.user });
  },
  oauth: async (req, res, next) => {
    delete req.user.password;
    const user = req.user;
    const token = await JWTsign(user);
    req.user.token = token;
    next();
  },
  resetPasswordByEmail: async (req, res) => {
    const { email } = req.body;
    const account_data = await prisma.accounts.findFirst({
      where: {
        email: email,
      },
    });
    if (!account_data)
      return res.status(404).json({
        status: "fail",
        message: "Account did not exist",
      });
    delete account_data.password;
    delete account_data.balance;
    delete account_data.createAt;
    delete account_data.updatedAt;

    const token = await JWTresetpassword(account_data);
    const link = `${req.protocol}://${req.get("host")}/resetpassword/${token}`;
    await sendMailResetPassword("Reset Password", account_data.email, link);
    res.status(200).json({
      status: "success",
      message: "Reset password link has been sent",
    });
  },
  resetPasswordData: async (req, res, next) => {
    const { password } = req.body;
    const { email, account_id } = req.user;
    const account_data = await prisma.accounts.findFirst({
      where: {
        email: email,
      },
    });
    if (!account_data)
      return res.status(404).json({
        status: "fail",
        message: "Account did not exist",
      });
    await prisma.accounts.update({
      where: {
        email: email,
        account_id: account_id,
      },
      data: {
        password: await auth.hashPassword(password),
      },
    });
    next();
  },
};
