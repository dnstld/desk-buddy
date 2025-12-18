/**
 * Validation schema for login form
 * Extracted for reusability and testability
 */

export const EMAIL_VALIDATION = {
  required: "Email address is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
} as const;

export const VALIDATION_MESSAGES = {
  emailRequired: "Email address is required",
  emailInvalid: "Please enter a valid email address",
  companyEmailRequired: "That doesn't look like a company email",
  magicLinkFailed: "Failed to send magic link. Please try again.",
} as const;

export type LoginFormData = {
  email: string;
};
