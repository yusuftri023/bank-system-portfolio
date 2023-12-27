const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { PrismaClient } = require("@prisma/client");
const { errorResponse } = require("./error_handling");
const prisma = new PrismaClient();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NODE_ENV } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:
        NODE_ENV === "development"
          ? `http://localhost:3000/auth/google/callback`
          : "https://bank-system-api.onrender.com/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const findUsers = await prisma.accounts.findFirst({
          where: {
            email: profile.emails[0].value,
          },
          select: {
            user_id: true,
            account_id: true,
            account_number: true,
            email: true,
            balance: true,
            googleId: true,
            status: true,
            role: true,
            users: {
              select: {
                user_id: true,
                user_name: true,
                identity_number: true,
                profiles: true,
              },
            },
          },
        });
        let user;
        if (findUsers !== null) {
          user = await prisma.accounts.upsert({
            where: {
              account_id: findUsers.account_id,
            },
            update: {
              googleId: profile.id,
            },
            create: {
              email: profile.emails[0].value,
              googleId: profile.id,
              password: "null",
              status: "Open",
              role: "User",
              users: {
                create: {
                  user_name: findUsers.users.user_name,
                  identity_number: findUsers.users.identity_number,
                },
              },
            },
          });
        } else {
          user = await prisma.accounts.upsert({
            where: {
              account_id: 99999999,
            },
            update: {
              googleId: profile.id,
            },
            create: {
              users: {
                create: {
                  user_name: "",
                  identity_number: profile.id,
                },
              },
              email: profile.emails[0].value,
              googleId: profile.id,
              password: "null",
              status: "Open",
              role: "User",
            },
          });
        }
        done(null, user);
      } catch (error) {
        console.log(error);
        done(new errorResponse(500, `Database Error: ${error.message}`), null);
      }
    }
  )
);
module.exports = passport;
