const model = require("./../../../model/v3/users");

module.exports = {
  async getUsers(req, res) {
    const { role } = req.user;
    const { page_number, display_limit, search } = req.query;
    if (role !== "Admin") {
      return res.status(401).json({
        status: "failed",
        message:
          "you're not authorized to access this page! You need to be an admin",
        data: null,
      });
    }
    const query_result = await model.showAllUsers(
      page_number,
      display_limit,
      search
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
    const { account_id } = req.user;
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        status: "failed",
        message:
          "you're not authorized to access this page! You need to be an admin",
        data: null,
      });
    }
    if (!+account_id) {
      return res.status(400).json({
        status: "fail",
        code: 400,
        message: "Bad Request!",
      });
    } else {
      const query_result = await model.searchUserById(+account_id);
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
      const { role } = req.user;
      const {
        user_name,
        identity_number,
        phone_number,
        identity_type,
        address,
        profile_picture,
      } = req.body;
      if (role !== "Admin") {
        return res.status(401).json({
          status: "failed",
          message:
            "you're not authorized to access this page! You need to be an admin",
          data: null,
        });
      }
      if (!user_name || !identity_number) {
        return res.status(400).json({
          status: "fail",
          code: 400,
          message: `Bad request!`,
        });
      }
      result = await model.userRegistration(
        user_name,
        identity_number,
        phone_number,
        identity_type,
        address,
        profile_picture
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
