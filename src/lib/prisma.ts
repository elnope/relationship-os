import { PrismaClient } from '@prisma/client';

declare global {
  // Prevent multiple instances in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient | undefined;

try {
  prisma = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
  }
} catch (error) {
  console.warn('Prisma client not available. Running in demo mode.');
}

export { prisma };
export default prisma;
