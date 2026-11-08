export const CONTACT_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MAX: 254,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 2000,
} as const;

export type ContactField = "name" | "email" | "message";

export type ContactValidationError =
  | "nameRequired"
  | "nameTooShort"
  | "nameTooLong"
  | "emailRequired"
  | "emailInvalid"
  | "emailTooLong"
  | "messageRequired"
  | "messageTooShort"
  | "messageTooLong";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website?: string;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeContactValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactField(
  field: ContactField,
  rawValue: unknown,
): ContactValidationError | null {
  const value = normalizeContactValue(rawValue);

  if (field === "name") {
    if (!value) return "nameRequired";
    if (value.length < CONTACT_LIMITS.NAME_MIN) return "nameTooShort";
    if (value.length > CONTACT_LIMITS.NAME_MAX) return "nameTooLong";
    return null;
  }

  if (field === "email") {
    if (!value) return "emailRequired";
    if (value.length > CONTACT_LIMITS.EMAIL_MAX) return "emailTooLong";
    if (!EMAIL_REGEX.test(value)) return "emailInvalid";
    return null;
  }

  if (!value) return "messageRequired";
  if (value.length < CONTACT_LIMITS.MESSAGE_MIN) return "messageTooShort";
  if (value.length > CONTACT_LIMITS.MESSAGE_MAX) return "messageTooLong";
  return null;
}

export function isHoneypotTriggered(rawWebsite: unknown): boolean {
  return normalizeContactValue(rawWebsite).length > 0;
}

export function validateContactPayload(input: Partial<Record<keyof ContactPayload, unknown>>):
  | { ok: true; data: { name: string; email: string; message: string } }
  | { ok: false; errors: Partial<Record<ContactField, ContactValidationError>> } {
  const nameError = validateContactField("name", input.name);
  const emailError = validateContactField("email", input.email);
  const messageError = validateContactField("message", input.message);

  if (nameError || emailError || messageError) {
    const errors: Partial<Record<ContactField, ContactValidationError>> = {};
    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (messageError) errors.message = messageError;
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name: normalizeContactValue(input.name),
      email: normalizeContactValue(input.email),
      message: normalizeContactValue(input.message),
    },
  };
}

export function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
