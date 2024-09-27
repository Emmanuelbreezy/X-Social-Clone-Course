// /* eslint-disable no-var */
// import { PrismaClient } from "@prisma/client";

// // Check if we are in development mode to avoid re-instantiating Prisma client
// declare global {
//   // This ensures the global declaration is not redefined on every module reload
//   var prisma: PrismaClient | undefined;
// }

// const client = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV === "development") {
//   // In development, store the Prisma client in a global variable to reuse the same instance
//   global.prisma = client;
// }

// export default client;

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
