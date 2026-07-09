import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export type AgentIdentity = {
  id: string;
  label: string;
  scopes: string[];
};

export const hashAgentApiKey = (apiKey: string) =>
  createHash("sha256").update(apiKey, "utf8").digest("hex");

export const getAgentApiKeyPrefix = (apiKey: string) => apiKey.slice(0, 16);

export const authenticateAgent = async (
  request: Request,
  requiredScopes: string[],
): Promise<{ agent: AgentIdentity } | { response: NextResponse }> => {
  if (!prisma) {
    return {
      response: NextResponse.json({ error: "Database is not configured." }, { status: 503 }),
    };
  }

  const authorization = request.headers.get("authorization");
  const apiKey = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined;

  if (!apiKey) {
    return {
      response: NextResponse.json({ error: "Missing bearer token." }, { status: 401 }),
    };
  }

  const keyHash = hashAgentApiKey(apiKey);
  const key = await prisma.agentApiKey.findFirst({
    where: {
      keyHash,
      revokedAt: null,
    },
  });

  if (!key) {
    return {
      response: NextResponse.json({ error: "Invalid or revoked agent API key." }, { status: 401 }),
    };
  }

  const hasScope = requiredScopes.every(
    (scope) => key.scopes.includes("*") || key.scopes.includes(scope),
  );

  if (!hasScope) {
    return {
      response: NextResponse.json({ error: "Agent API key lacks required scope." }, { status: 403 }),
    };
  }

  await prisma.agentApiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    agent: {
      id: key.id,
      label: key.label,
      scopes: key.scopes,
    },
  };
};
