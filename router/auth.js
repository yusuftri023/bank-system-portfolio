const express = require("express");
const router = express.Router();
const controller = require("./../app/controller");
const passport = require("./../utils/passport");
const { auth, resetPasswordToken, authCookies } = require("../utils/jwt");
const passportOauth = require("../utils/oauth");

// session based authentication
router.get("/api/v2/auth/register", async (req, res) => {
  res.render("register");
});
router.post("/api/v2/auth/register", controller.authV2.registerForm);

router.get("/api/v2/auth/login", async (req, res) => {
  res.render("login_session");
});

router.post(
  "/api/v2/auth/login",
  passport.authenticate("local", {
    successRedirect: "/api/v2/auth/dashboard",
    failureRedirect: "/api/v2/auth/login",
  })
);
router.get("/api/v2/auth/dashboard", controller.authV2.dashboard);

router.get("/dashboard", authCookies, controller.authV3.dashboard);
router.get(
  "/auth/google",
  passportOauth.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passportOauth.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  controller.authV3.oauth,
  (req, res) => {
    res
      .cookie("access_token", req.user.token, { secure: true, httpOnly: true })
      .redirect("/dashboard");
  }
);

// token based authentication
router.get("/whoami", authCookies, controller.authV3.whoami);
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", controller.authV3.registerNewAccount, (req, res) => {
  res.redirect("/login");
});
router.get("/login", async (req, res) => {
  res.render("login");
});
router.get("/logout", authCookies, controller.authV3.logoutAccount);
router.post("/login", controller.authV3.loginAccount);
router.get("/resetpassword", (req, res) => {
  res.render("reset_password");
});
router.post("/resetpassword", controller.authV3.resetPasswordByEmail);

router.get("/resetpassword/:reset_token", resetPasswordToken, (req, res) => {
  res.render("reset_password_form", {
    link: `/resetpassword/${req.params.reset_token}`,
  });
});
router.post(
  "/resetpassword/:reset_token",
  resetPasswordToken,
  controller.authV3.resetPasswordData,
  (req, res) => {
    res.render("reset_password_redirect");
  }
);
// v3 token based

router.post("/api/v3/auth/register", controller.authV3.registerNewAccount);

module.exports = router;
