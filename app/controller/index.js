const usersV2 = require("./api/v2/users");
const accountsV2 = require("./api/v2/accounts");
const transactionsV2 = require("./api/v2/transactions");
const mediaV2 = require("./api/v2/media");
const authV2 = require("./api/v2/auth");

const usersV3 = require("./api/v3/users");
const accountsV3 = require("./api/v3/accounts");
const transactionsV3 = require("./api/v3/transactions");
const mediaV3 = require("./api/v3/media");
const authV3 = require("./api/v3/auth");

module.exports = {
  usersV2,
  accountsV2,
  transactionsV2,
  mediaV2,
  authV2,
  usersV3,
  accountsV3,
  transactionsV3,
  mediaV3,
  authV3,
};
