"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_express5 = __toESM(require("express"), 1);

// src/core/attach-middlewares.ts
var import_cors = __toESM(require("cors"), 1);
var import_express = __toESM(require("express"), 1);
var import_express_session = __toESM(require("express-session"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_passport = __toESM(require("passport"), 1);
var import_passport_local = __toESM(require("passport-local"), 1);

// src/middlewares/index.ts
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ message: "Pardon, who are you?" });
}
function errorCatcher(err, _req, res, _next) {
  console.error(err);
  return res.status(500).json({ message: "Come home, kitchen's on fire." });
}

// src/core/attach-middlewares.ts
function attachMiddlewares(app2) {
  app2.use(import_express.default.json());
  app2.use(import_express.default.urlencoded({ extended: true }));
  app2.use((0, import_helmet.default)());
  app2.use(
    (0, import_cors.default)({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true
    })
  );
  app2.use(
    (0, import_express_session.default)({
      name: "session",
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        // Secure cookie only available over https, but your localhost is http,
        // so this must be false during development.
        secure: process.env.NODE_ENV === "production"
      }
    })
  );
  app2.use(import_passport.default.session());
  import_passport.default.use(
    "local",
    new import_passport_local.default.Strategy(
      {
        usernameField: "email"
      },
      (email, password, cb) => {
        const user = {
          id: 1,
          name: "John Doe"
        };
        return cb(null, user);
      }
    )
  );
  import_passport.default.serializeUser((user, cb) => {
    process.nextTick(() => {
      cb(null, user);
    });
  });
  import_passport.default.deserializeUser((user, cb) => {
    process.nextTick(() => {
      cb(null, user);
    });
  });
  app2.use(errorCatcher);
}

// src/core/attach-routes.ts
var import_express4 = __toESM(require("express"), 1);

// src/modules/account/account.controller.ts
var import_express2 = __toESM(require("express"), 1);
var import_passport2 = __toESM(require("passport"), 1);

// src/modules/account/account.service.ts
function accountInfo(req, res) {
  return res.status(200).json({ message: "Hi there!", user: req.user });
}

// src/modules/account/account.controller.ts
var accountRouter = import_express2.default.Router().get("/", ensureAuthenticated, accountInfo).post("/authenticate", import_passport2.default.authenticate("local"), (req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(400).json({ message: "Ah, who are you again?" });
  }
  return res.status(200).json({ message: "Look who is back!", user: req.user });
});

// src/modules/scores/scores.controller.ts
var import_express3 = __toESM(require("express"), 1);

// src/modules/scores/scores.service.ts
function getScores(req, res) {
  return res.status(200).json({ message: "Hi there!", user: req.user });
}

// src/modules/scores/scores.controller.ts
var scoresRouter = import_express3.default.Router().get("/", getScores).post("/update", ensureAuthenticated, (req, res) => {
});

// src/core/attach-routes.ts
function attachRoutes(app2) {
  const router = import_express4.default.Router();
  router.use("/account", accountRouter);
  router.use("/scores", scoresRouter);
  app2.use("/api/v1", router);
  app2.get("/healthcheck", (_, res) => {
    return res.status(200).json({ message: "Service is healthy." });
  });
  app2.get("/", (_, res) => {
    return res.status(200).json({ message: "Welcome to the service. This is the root path." });
  });
}

// src/core/index.ts
function configureServer(app2) {
  attachMiddlewares(app2);
  attachRoutes(app2);
}

// src/index.ts
var app = (0, import_express5.default)();
configureServer(app);
var PORT = process.env.PORT || 8e3;
app.listen(PORT, () => {
  console.log(`Server is up on PORT ${PORT}`);
});
//# sourceMappingURL=index.cjs.map
