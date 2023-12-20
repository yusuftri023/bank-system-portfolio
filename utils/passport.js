const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const { authUser } = require("./../app/controller/api/v2/auth");
const prisma = new PrismaClient();

passport.serializeUser((user, callback) => callback(null, user.email));
passport.deserializeUser(async (email, callback) => {
  callback(
    null,
    await prisma.accounts.findUnique({
      where: {
        email,
      },
    })
  );
});
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    authUser
  )
);

module.exports = passport;
