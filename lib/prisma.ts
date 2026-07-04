import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
// Đã sửa đổi: Khớp chuẩn xác với output "../app/generated/prisma"
import { PrismaClient } from "../app/generated/prisma"; 
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };

