const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  async searchAccounts(page_number = 1, display_limit = 10, search1 = "") {
    const result = await prisma.accounts.findMany({
      where: {
        email: {
          contains: search1,
        },
      },
      take: +display_limit,
      skip: +display_limit * (+page_number - 1),
      select: {
        account_id: true,
        email: true,
        balance: true,
      },
    });
    return result;
  },
  async searchAccountById(id) {
    let showUser = await prisma.accounts.findUnique({
      where: {
        account_id: id,
      },
    });
    return showUser;
  },
  async searchAccountId(id) {
    let showUser = await prisma.accounts.findUnique({
      where: {
        account_id: id,
      },
    });
    if (showUser !== null) {
      return true;
    } else {
      return false;
    }
  },
  async searchUserId(id) {
    let showUser = await prisma.users.findUnique({
      where: {
        user_id: id,
      },
    });
    return showUser;
  },
  async createNewAccount(
    email,
    user_id,
    hashed_password,
    balance = 100000,
    role = "User",
    status = "Open"
  ) {
    try {
      const createAccount = await prisma.accounts.create({
        data: {
          balance: balance,
          email: email,
          password: hashed_password,
          user_id: user_id,
          role: role,
          status: status,
        },
      });
      return createAccount;
    } catch (error) {
      throw error.message;
    }
  },
  async deleteAccount(id) {
    const result = await prisma.accounts.delete({
      where: {
        account_id: +id,
      },
      select: {
        account_id: true,
        email: true,
      },
    });
    return result;
  },
};
