import { EventInput, EventPlan, EventInputSchema, EventPlanSchema } from "@/lib/schemas/event";

export interface SharedPlanData {
  input: EventInput;
  plan: EventPlan;
  source: string;
}

/**
 * Encodes plan data into a URL-safe Base64 string
 */
export function encodePlanToHash(data: SharedPlanData): string {
  try {
    const jsonStr = JSON.stringify(data);
    // UTF-8 safe base64 encoding
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const base64 = btoa(binary);
    // Make URL-safe (replace + with -, / with _, and strip =)
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (err) {
    console.error("Failed to encode plan data:", err);
    return "";
  }
}

/**
 * Decodes a URL-safe Base64 string back into validated plan data
 */
export function decodePlanFromHash(hashString: string): SharedPlanData | null {
  try {
    if (!hashString) return null;

    // Clean hash prefix if present (#share=... or share=...)
    let clean = hashString;
    if (clean.startsWith("#")) clean = clean.substring(1);
    if (clean.startsWith("share=")) clean = clean.substring(6);

    // Reconstruct base64
    let base64 = clean.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);

    if (!parsed || !parsed.input || !parsed.plan) return null;

    // Strict schema validation to ensure safety
    const inputValid = EventInputSchema.safeParse(parsed.input);
    const planValid = EventPlanSchema.safeParse(parsed.plan);

    if (!inputValid.success || !planValid.success) {
      console.warn("Shared plan failed schema validation:", {
        inputErrors: inputValid.success ? null : inputValid.error,
        planErrors: planValid.success ? null : planValid.error,
      });
      return null;
    }

    return {
      input: inputValid.data,
      plan: planValid.data,
      source: parsed.source || "shared-link",
    };
  } catch (err) {
    console.warn("Could not decode shared plan from URL hash:", err);
    return null;
  }
}

/**
 * Generates full shareable URL
 */
export function getShareableUrl(data: SharedPlanData): string {
  const hash = encodePlanToHash(data);
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}#share=${hash}`;
}
