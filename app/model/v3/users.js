const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  async showAllUsers(page_number = 1, display_limit = 10, search = "") {
    let showUsers = prisma.users.findMany({
      where: {
        user_name: {
          contains: `${search}`,
          mode: "insensitive",
        },
      },
      select: {
        user_id: true,
        user_name: true,
        identity_number: true,
        profiles: {
          select: {
            profile_id: true,
            identity_type: true,
            phone_number: true,
            address: true,
            profile_picture: true,
          },
        },
        accounts: true,
      },
      skip: +display_limit * (page_number - 1),
      take: +display_limit,
      orderBy: {
        user_id: "asc",
      },
    });
    return showUsers;
  },
  async searchUserId(id) {
    let showUser = await prisma.users.findUnique({
      where: {
        user_id: id,
      },
    });
    if (showUser !== null) {
      return true;
    } else {
      return false;
    }
  },
  async searchUserById(id) {
    let showUser = await prisma.users.findUnique({
      where: {
        user_id: id,
      },
      select: {
        user_id: true,
        user_name: true,
        profiles: true,
      },
    });
    return showUser;
  },
  async userRegistration(
    userName,
    identityNumber,
    phoneNumber = "",
    identityType = "KTP",
    Address = "",
    profilePic = "https://ik.imagekit.io/neuros123/default-profile-pic.png"
  ) {
    try {
      let user = await prisma.users.create({
        data: {
          user_name: userName,
          identity_number: identityNumber,
          profiles: {
            create: {
              phone_number: phoneNumber,
              identity_type: identityType,
              address: Address,
              profile_picture: profilePic,
            },
          },
        },
        select: {
          user_id: true,
          user_name: true,
          identity_number: true,
          profiles: {
            select: {
              profile_id: true,
              identity_type: true,
              phone_number: true,
              address: true,
              profile_picture: true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  },
  async update_user(id, body) {
    try {
      let updated_user = await prisma.users.update({
        where: {
          user_id: id,
        },
        data: {
          user_name: body.user_name,
          identity_number: body.identity_number,
        },
      });
      let search_profile_id = await prisma.profiles.findFirst({
        where: {
          user_id: id,
        },
        select: {
          profile_id: true,
        },
      });

      let updated_profiles = await prisma.profiles.update({
        where: {
          user_id: id,
          profile_id: search_profile_id.profile_id,
        },
        data: {
          phone_number: body.phone_number,
          identity_type: body.identity_type,
          address: body.address,
        },
      });
      return {
        status: "success",
        code: 200,
        message: "User data updated",
        data: { updated_user, updated_profiles },
      };
    } catch (error) {
      throw error;
    }
  },
  async delete_user(id) {
    return await prisma.users.delete({
      where: {
        user_id: id,
      },
    });
  },
  async findProfile(userId) {
    return await prisma.profiles.findFirst({
      where: {
        user_id: +userId,
      },
    });
  },
  async updateProfile(
    user_id,
    profile_picture = "https://ik.imagekit.io/neuros123/default-profile-pic.png"
  ) {
    try {
      const profileId = await prisma.profiles.findFirst({
        where: {
          user_id: user_id,
        },
        select: {
          profile_id: true,
        },
      });
      const result = await prisma.profiles.update({
        where: {
          user_id: user_id,
          profile_id: profileId.profile_id,
        },
        data: {
          profile_picture: profile_picture,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
};
