import { SessionConfig } from "@abstract-foundation/agw-client/sessions";

const SESSION_KEY = "agw-session-config";

// Custom serializer that handles BigInt values
export function serializeWithBigInt(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    // Convert BigInt to string with a special prefix
    if (typeof value === "bigint") {
      return `__bigint__${value.toString()}`;
    }
    return value;
  });
}

// Custom deserializer that converts BigInt strings back to BigInt
export function deserializeWithBigInt(json: string): any {
  return JSON.parse(json, (key, value) => {
    // Check if the value is a string and has our special BigInt prefix
    if (typeof value === "string" && value.startsWith("__bigint__")) {
      // Convert back to BigInt
      return BigInt(value.substring(10)); // Remove the '__bigint__' prefix
    }
    return value;
  });
}

export function saveSessionConfig(config: SessionConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, serializeWithBigInt(config));
  }
}

export function getSessionConfig(): SessionConfig | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      return deserializeWithBigInt(stored) as SessionConfig;
    }
  }
  return null;
}

export function hasValidSession(): boolean {
  const config = getSessionConfig();
  if (!config) return false;

  // Check if session is expired
  const now = BigInt(Math.floor(Date.now() / 1000));
  return config.expiresAt > now;
}

export function clearSessionConfig(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
