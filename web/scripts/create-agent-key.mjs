import { createHash, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const label = process.argv[2] ?? "initial-agent";
const scopes = process.argv.slice(3);
const defaultScopes = ["ideas:read", "ideas:write", "signals:write", "artifacts:write", "reports:write"];
const apiKey = `pie_live_${randomBytes(32).toString("base64url")}`;
const keyHash = createHash("sha256").update(apiKey, "utf8").digest("hex");
const keyPrefix = apiKey.slice(0, 16);

const main = async () => {
  await prisma.agentApiKey.create({
    data: {
      label,
      keyPrefix,
      keyHash,
      scopes: scopes.length > 0 ? scopes : defaultScopes,
    },
  });

  console.log("Created product ideation agent API key.");
  console.log(`Label: ${label}`);
  console.log(`Prefix: ${keyPrefix}`);
  console.log(`Scopes: ${(scopes.length > 0 ? scopes : defaultScopes).join(", ")}`);
  console.log("");
  console.log(apiKey);
  console.log("");
  console.log("Store this key now. It is hashed in the database and cannot be recovered later.");
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
