const jwt = require("jsonwebtoken");
let { JWT_SECRET_KEY } = process.env;

async function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: "failed",
      message: "you're not authorized to access this page!",
      data: null,
    });
  }
  jwt.verify(authorization, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "failed",
        message: "you're not authorized to access this page!",
        err: err.message,
        data: null,
      });
    }
    req.user = decoded;
    next();
  });
}
async function authCookies(req, res, next) {
  const { access_token } = req.cookies;

  if (!access_token) {
    return res.status(401).json({
      status: "failed",
      message: "you're not authorized to access this page!",
      data: null,
    });
  }
  jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "failed",
        message: "you're not authorized to access this page!",
        err: err.message,
        data: null,
      });
    }
    req.user = decoded;
    next();
  });
}
async function resetPasswordToken(req, res, next) {
  const { reset_token } = req.params;

  if (!reset_token) {
    return res.status(401).json({
      status: "failed",
      message: "you're not authorized to access this page!",
      data: null,
    });
  }

  jwt.verify(reset_token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "failed",
        message: "you're not authorized to access this page!",
        err: err.message,
        data: null,
      });
    }

    req.user = decoded;
    next();
  });
}
async function JWTsign(user) {
  let token = jwt.sign(user, JWT_SECRET_KEY, { expiresIn: 60 * 60 });
  return token;
}
async function JWTresetpassword(data) {
  let token = jwt.sign(data, JWT_SECRET_KEY, { expiresIn: 15 * 60 });
  return token;
}
module.exports = {
  auth,
  JWTsign,
  resetPasswordToken,
  authCookies,
  JWTresetpassword,
};
