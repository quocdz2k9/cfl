import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
// Thay đổi dòng này:
import { PrismaClient } from "../app/generated/prisma/client"; // [!code ++]
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`;

// Sử dụng Pool từ gói thư viện 'pg' theo chuẩn Driver Adapter
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };

