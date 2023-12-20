require("dotenv").config();

const { ProfilingIntegration } = require("@sentry/profiling-node");
const Sentry = require("@sentry/node");
const express = require("express");
const app = express();
const port = 3300;
const http = require("http").createServer(app);
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const routers = require("./router/index");
const swaggerJSON = require("./api_documentation.json");
const swaggerUI = require("swagger-ui-express");
const passport = require("./utils/passport");
const { qrGenerate } = require("./app/controller/api/v2/media");
require("./utils/api-documentation-env").apiDocumentationInitialization();
app.use(morgan("combined"));
app.use(cookieParser());
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "Nothing to see here",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./app/views"));
Sentry.init({
  dsn: process.env.SENTRY_ID,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get("/", (req, res) => {
  res.render("index");
});
app.use(express.static("public"));
app.post("/qr/png", qrGenerate);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON));

app.use(routers);
app.use(Sentry.Handlers.errorHandler());

const server = http.listen(process.env.PORT || port, () =>
  console.log(`Server run at http://127.0.0.1:${port}`)
);

module.exports = app;
