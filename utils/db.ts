import { PrismaClient } from "@prisma/client"; 

const prismaClientSingleton = () => {
    // Default fallback for DATABASE_URL if not set
    if (!process.env.DATABASE_URL) {
        process.env.DATABASE_URL = "file:./dev.db";
    }

    // Log database configuration for debugging
    if (process.env.NODE_ENV === "development") {
        try {
            if (process.env.DATABASE_URL.startsWith('mysql')) {
                const url = new URL(process.env.DATABASE_URL);
                console.log(` Database connection: ${url.protocol}//${url.hostname}:${url.port || '3306'}`);
                console.log(`🔒 SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`);
            } else {
                console.log(` Database connection: ${process.env.DATABASE_URL}`);
            }
        } catch (e) {
            console.log(` Database configured: ${process.env.DATABASE_URL}`);
        }
    }

    return new PrismaClient({
        // Add logging for debugging
        log: process.env.NODE_ENV === "development" 
            ? ['query', 'info', 'warn', 'error']
            : ['error', 'warn'],
    });
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;