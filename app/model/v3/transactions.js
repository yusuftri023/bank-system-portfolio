const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  async transactionTransfer(id_pengirim, id_penerima, nilai) {
    try {
      const [pengirim, penerima, Transfer] = await prisma.$transaction([
        prisma.accounts.update({
          data: {
            balance: {
              decrement: +nilai,
            },
          },
          where: {
            account_number: +id_pengirim,
          },
        }),

        prisma.accounts.update({
          data: {
            balance: {
              increment: +nilai,
            },
          },
          where: {
            account_number: +id_penerima,
          },
        }),
        prisma.transactions.create({
          data: {
            transaction_type: "Transfer",
            amount: +nilai,
            destination_account: +id_penerima,
            source_account: +id_pengirim,
          },
        }),
      ]);
      return Transfer;
    } catch (error) {
      throw error;
    }
  },
  async transactionWithdraw(id_pengguna, nilai) {
    try {
      const [pengguna, Withdraw] = await prisma.$transaction([
        prisma.accounts.update({
          data: {
            balance: {
              decrement: +nilai,
            },
          },
          where: {
            account_number: +id_pengguna,
          },
        }),
        prisma.transactions.create({
          data: {
            transaction_type: "Withdraw",
            amount: +nilai,
            destination_account: +id_pengguna,
            source_account: +id_pengguna,
          },
        }),
      ]);
      return Withdraw;
    } catch (error) {
      throw error;
    }
  },
  async transactionDeposit(id_pengguna, nilai) {
    try {
      const [pengguna, Deposit] = await prisma.$transaction([
        prisma.accounts.update({
          data: {
            balance: {
              increment: +nilai,
            },
          },
          where: {
            account_number: +id_pengguna,
          },
        }),
        prisma.transactions.create({
          data: {
            transaction_type: "Deposit",
            amount: +nilai,
            destination_account: +id_pengguna,
            source_account: +id_pengguna,
          },
        }),
      ]);
      return Deposit;
    } catch (error) {
      throw error;
    }
  },
  async getAccountByAccNum(accNumber) {
    const result = await prisma.accounts.findUnique({
      where: {
        account_number: +accNumber,
      },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  },
  async showAllTransactions(page = 1, limit = 10, search = 0) {
    try {
      const result = await prisma.transactions.findMany({
        where: {
          amount: {
            gte: +search,
          },
        },
        take: +limit,
        skip: +limit * (+page - 1),
        orderBy: {
          transaction_id: "asc",
        },
      });
      return result;
    } catch (error) {
      throw error.message;
    }
  },
  async getSpecificTransaction(id) {
    try {
      const result = await prisma.transactions.findMany({
        where: {
          transaction_id: id,
        },
      });
      if (result) {
        return result;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
  async getTransactionsByAccountId(
    account_number,
    page_number = 1,
    display_limit = 10
  ) {
    const result = await prisma.accounts.findMany({
      where: {
        account_number: +account_number,
      },
      select: {
        account_number: true,
        account_id: true,
        balance: true,
        user_id: true,
        email: true,
        createAt: true,
        updatedAt: true,
        transactionSource: true,
      },
      take: +display_limit,
      skip: +display_limit * (page_number - 1),

      orderBy: {
        account_number: "asc",
      },
    });
    return result;
  },
  async deleteTransaction(id) {
    try {
      return await prisma.transactions.delete({
        where: {
          transaction_id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
