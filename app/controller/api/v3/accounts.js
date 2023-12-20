const model = require("./../../../model/v3/accounts");
const bcrypt = require("bcrypt");
module.exports = {
  async getAccounts(req, res) {
    if (req.query) {
      let result = await model.searchAccounts(
        req.query.page_number,
        req.query.display_limit,
        req.query.search
      );
      if (!result.length) {
        res.status(200).json({
          status: "success",
          code: 200,
          message: "Data empty",
        });
      } else {
        res.status(200).json({
          status: "success",
          code: 200,
          message: "Account search complete",
          data: result,
        });
      }
    }
  },
  async getAccountById(req, res) {
    if (!+req.params.id) {
      res.status(400).json({
        status: "fail",
        code: 400,
        message: "Bad Request! id required and need to be a number",
      });
    } else {
      const query_result = await model.searchAccountById(+req.params.id);
      if (query_result) {
        res.status(200).json({
          status: "success",
          code: 200,
          message: "Search by id complete",
          data: query_result,
        });
      } else {
        res.status(404).json({
          status: "fail",
          code: 404,
          message: `Account doesn't exist`,
        });
      }
    }
  },
  async postAccount(req, res) {
    try {
      if (
        !req.body.email ||
        !req.body.password ||
        !+req.body.balance ||
        !req.body.identity_number
      ) {
        return res.status(400).json({
          status: "fail",
          code: 400,
          message: "Bad request : request is not complete ",
        });
      }
      const search_id = await model.searchUserId(req.body.identity_number);
      if (!search_id) {
        return res.status(404).json({
          status: "fail",
          code: 404,
          message: "User does not exist",
        });
      } else {
        let hashed_password = await bcrypt.hash(req.body.password, 10);
        const result = await model.createNewAccount(
          req.body.balance,
          req.body.password,
          req.body.email,
          search_id.user_id,
          hashed_password
        );
        if (result) {
          return res.status(201).json({
            status: "success",
            code: 201,
            message: "Account has been created",
            data: result,
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        status: "fail",
        code: 400,
        message: "Email already exist",
      });
    }
  },
  async deleteAccountById(req, res) {
    if (!+req.params.id || !req.params.id) {
      return res.status(400).json({
        status: "fail",
        code: 400,
        message: "Bad Request! id required and need to be a number",
      });
    }
    const search = await model.searchAccountId(+req.params.id);
    if (search) {
      const result = await model.deleteAccount(+req.params.id);
      res.status(200).json({
        status: "success",
        code: 200,
        message: "Account deleted",
        data: result,
      });
    } else {
      res.status(404).json({
        status: "fail",
        code: 404,
        message: "Account does not exist",
      });
    }
  },
};
