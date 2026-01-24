// Prisma 7 설정 파일
// 로컬 개발용: SQLite
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 로컬 개발용 SQLite (배포 시 process.env["DATABASE_URL"]로 변경)
    url: "file:./prisma/dev.db",
  },
});
