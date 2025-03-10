/**
 * In this example, we store the session key objects in the browser's localStorage.
 * This file is a set of helper functions to:
 *  - Serialize and deserialize the session key objects to and from strings.
 *  - Save and retrieve the session key objects to localStorage.
 *  - Check if a session key is valid.
 *  - Clear the session key from localStorage.
 */
import { SessionConfig } from "@abstract-foundation/agw-client/sessions";

// The key to store the session key objects in localStorage
const SESSION_KEY = "agw-session-config";

// Serialize the session key with a hack to handle BigInt values
export function serializeWithBigInt(obj: SessionConfig): string {
  return JSON.stringify(obj, (key, value) => {
    // Convert BigInt to string with a special prefix
    if (typeof value === "bigint") {
      return `__bigint__${value.toString()}`;
    }
    return value;
  });
}

// Deserialize the session key with a hack to handle BigInt values
export function deserializeWithBigInt(json: string) {
  return JSON.parse(json, (key, value) => {
    // Check if the value is a string and has our special BigInt prefix
    if (typeof value === "string" && value.startsWith("__bigint__")) {
      // Convert back to BigInt
      return BigInt(value.substring(10)); // Remove the '__bigint__' prefix
    }
    return value;
  });
}

/**
 * Save the session key to localStorage.
 * @param config - The session key configuration object.
 */
export function saveSessionConfig(config: SessionConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, serializeWithBigInt(config));
  }
}

/**
 * Get the session key from localStorage.
 * @returns The session key configuration object or null if it doesn't exist.
 */
export function getSessionConfig(): SessionConfig | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      return deserializeWithBigInt(stored) as SessionConfig;
    }
  }
  return null;
}

/**
 * Check if the session key is valid by comparing the current time with the expiration time.
 * @returns True if the session key is valid, false otherwise.
 */
export function hasValidSession(): boolean {
  const config = getSessionConfig();
  if (!config) return false;

  const now = BigInt(Math.floor(Date.now() / 1000));
  return config.expiresAt > now;
}

/**
 * Clear the session key from localStorage.
 */
export function clearSessionConfig(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
