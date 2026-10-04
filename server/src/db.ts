import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
export let databaseAvailable = false;

export async function connectDatabase() {
  if (!process.env.DATABASE_URL) {
    console.info('DATABASE_URL is not set; using the in-memory demo adapter.');
    return false;
  }
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    databaseAvailable = true;
    console.info('PostgreSQL connected; Prisma persistence is enabled.');
    return true;
  } catch (error) {
    databaseAvailable = false;
    console.warn('PostgreSQL is unavailable; using the in-memory demo adapter.', error instanceof Error ? error.message : '');
    return false;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

