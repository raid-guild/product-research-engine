import { NextResponse } from "next/server";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { runsDirectory } from "@/lib/ideation-runs";

export async function GET() {
  let database = "not_configured";

  if (prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "ok";
    } catch {
      database = "error";
    }
  }

  return NextResponse.json({
    ok: true,
    database,
    databaseConfigured: isDatabaseConfigured,
    runsDirectory,
  });
}
