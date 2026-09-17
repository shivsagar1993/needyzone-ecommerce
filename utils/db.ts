import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function resolveDatabaseUrl(): string {
  // If a remote MySQL or Postgres connection string is configured, use it directly
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    return process.env.DATABASE_URL;
  }

  // If running on Vercel or AWS Lambda (read-only container root)
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
        path.resolve("./prisma/dev.db"),
        path.resolve("./dev.db"),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            console.log(`[DB] Successfully copied SQLite database to ${tmpDbPath} from ${candidate}`);
            break;
          } catch (err) {
            console.warn(`[DB] Failed copying SQLite from ${candidate}:`, err);
          }
        }
      }
    }

    const resolved = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = resolved;
    return resolved;
  }

  // Local development: resolve to absolute path of prisma/dev.db
  const localDb = path.join(process.cwd(), "prisma", "dev.db");
  const localUrl = `file:${localDb}`;
  process.env.DATABASE_URL = localUrl;
  return localUrl;
}

const activeDbUrl = resolveDatabaseUrl();

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;