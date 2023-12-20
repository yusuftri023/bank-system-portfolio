const model = require("./../../../model/v2/users");

module.exports = {
  async getUsers(req, res) {
    const query_result = await model.showAllUsers(
      req.query.page_number,
      req.query.display_limit,
      req.query.search
    );
    if (!query_result.length) {
      res.status(200).json({
        status: "success",
        code: 200,
        message: "Data Empty",
      });
    } else {
      res.status(200).json({
        status: "success",
        code: 200,
        message: "Request has succeeded",
        data: query_result,
      });
    }
  },
  async getUsersById(req, res) {
    if (!+req.params.id) {
      return res.status(400).json({
        status: "fail",
        code: 400,
        message: "Bad Request!",
      });
    } else {
      const query_result = await model.searchUserById(+req.params.id);
      if (query_result) {
        return res.status(200).json({
          status: "success",
          code: 200,
          message: "Query successfully displayed",
          data: query_result,
        });
      } else {
        res.status(200).json({
          status: "success",
          code: 200,
          message: "There is no record with that id",
        });
      }
    }
  },
  async postUsers(req, res) {
    try {
      if (!req.body.user_name || !req.body.identity_number) {
        return res.status(400).json({
          status: "fail",
          code: 400,
          message: `Bad request!`,
        });
      }
      result = await model.userRegistration(
        req.body.user_name,
        req.body.phone_number,
        req.body.identity_type,
        req.body.identity_number,
        req.body.address
      );
      if (result) {
        res.status(201).json({
          status: "success",
          code: 201,
          message: "User data succesfully added to the database",
          data: result,
        });
      }
    } catch (error) {
      res.status(409).json({
        status: "fail",
        code: 409,
        message: error.message,
      });
    }
  },
  async deleteUserById(req, res) {
    if (!+req.params.id) {
      res.status(400).json({
        status: "fail",
        code: 400,
        message: "Bad request",
      });
    } else {
      const search = await model.searchUserById(+req.params.id);
      if (search) {
        let deleteUser = await model.delete_user(+req.params.id);
        res.status(200).json({
          status: "success",
          code: 200,
          message: "User has been deleted",
          data: deleteUser,
        });
      } else {
        res.status(404).json({
          status: "fail",
          code: 404,
          message: "user tidak ada didatabase",
        });
      }
    }
  },
  async putUsersById(req, res) {
    try {
      const put_parameter = [
        "user_name",
        "phone_number",
        "identity_type",
        "identity_number",
        "address",
      ];
      if (
        !put_parameter.every((value) =>
          Object.keys(req.body).includes(value)
        ) ||
        !+req.params.id
      ) {
        return res.status(400).json({
          status: "fail",
          code: 400,
          message:
            "Bad request: request form incomplete or the id is not integer",
        });
      }

      let search = await model.searchUserId(+req.params.id);
      if (search) {
        let result = await model.update_user(+req.params.id, req.body);
        res.status(201).json({
          status: "success",
          code: 201,
          message: "User data updated",
          data: result,
        });
      } else {
        return res.status(404).json({
          status: "fail",
          code: 404,
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(409).json({
        status: "fail",
        code: 409,
        message: error.message,
      });
    }
  },
  async putProfilePicById(req, res, next) {
    try {
      const { user_id } = req.user;
      const { url } = req.uploadImage;
      const isProfileExist = await model.findProfile(user_id);
      if (!isProfileExist) {
        return res.status(400).json({
          status: "fail",
          message: "User profile does not exist",
        });
      }

      const result = await model.updateProfile(+user_id, url);
      if (result) {
        return res.status(200).json({
          status: true,
          message: "User profile avatar updated",
          data: {
            avatar_url: result.profile_picture,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  },
};
