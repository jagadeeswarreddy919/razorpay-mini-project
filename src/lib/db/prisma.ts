import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string {
  // If explicitly provided custom Postgres/Supabase URL, use it
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // On Vercel / AWS Lambda Serverless environments:
  // Root filesystem is read-only. Copy pre-seeded dev.db to writable /tmp/dev.db
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    try {
      const tmpDbPath = path.join('/tmp', 'dev.db');
      const prismaDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
      const rootDbPath = path.join(process.cwd(), 'dev.db');

      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(prismaDbPath)) {
          fs.copyFileSync(prismaDbPath, tmpDbPath);
        } else if (fs.existsSync(rootDbPath)) {
          fs.copyFileSync(rootDbPath, tmpDbPath);
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (err) {
      console.error('Error setting up serverless SQLite in /tmp:', err);
    }
  }

  return process.env.DATABASE_URL || 'file:./dev.db';
}

const dbUrl = getDatabaseUrl();
process.env.DATABASE_URL = dbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
