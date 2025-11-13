"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Helper to convert Prisma Decimal to number
const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) serialized.balance = obj.balance.toNumber();
  if (obj.amount) serialized.amount = obj.amount.toNumber();
  return serialized;
};

// GET account with transactions
export async function getAccountWithTransactions(accountId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findFirst({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const account = await db.account.findFirst({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: { orderBy: { date: "desc" } },
      _count: { select: { transactions: true } },
    },
  });

  if (!account) return null;

  return {
    ...serializeDecimal(account),
    transactions: account.transactions.map(serializeDecimal),
  };
}

// Bulk delete transactions
export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const transactions = await db.transaction.findMany({
      where: { id: { in: transactionIds }, userId: user.id },
    });

    // Group balance changes by account
    const accountBalanceChanges = transactions.reduce((acc, t) => {
      const change = t.type === "EXPENSE" ? t.amount : -t.amount;
      acc[t.accountId] = (acc[t.accountId] || 0) + change;
      return acc;
    }, {});

    await db.$transaction(async (tx) => {
      // Delete transactions
      await tx.transaction.deleteMany({
        where: { id: { in: transactionIds }, userId: user.id },
      });

      // Update account balances
      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: balanceChange } },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Update default account
export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    // Unset current default
    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default
    const account = await db.account.findFirst({
      where: { id: accountId, userId: user.id },
    });

    if (!account) throw new Error("Account not found");

    await db.account.update({
      where: { id: account.id },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");

    return { success: true, data: serializeDecimal(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
