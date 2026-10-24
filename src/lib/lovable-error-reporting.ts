export function reportLovableError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  console.error("[RINCO Error]", error, context);
}
