import { useState } from "react";

interface MagicLinkError {
  message: string;
  type: "expired" | "used" | "invalid" | null;
}

export function useMagicLinkTracker() {
  const [usedMagicLinks, setUsedMagicLinks] = useState<Set<string>>(new Set());
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [error, setError] = useState<MagicLinkError>({
    message: "",
    type: null,
  });

  const isLinkUsed = (linkId: string): boolean => {
    return usedMagicLinks.has(linkId);
  };

  const markLinkAsUsed = (linkId: string) => {
    setUsedMagicLinks((prev) => new Set([...prev, linkId]));
  };

  const isLinkExpired = (expiresAt: number | null): boolean => {
    if (!expiresAt) return false;
    return expiresAt < Math.floor(Date.now() / 1000);
  };

  const setExpiredError = () => {
    setError({
      message:
        "Your magic link has expired. Please enter your email again to receive a new link.",
      type: "expired",
    });
  };

  const setUsedError = () => {
    setError({
      message:
        "This magic link has already been used. Please enter your email again to receive a new link.",
      type: "used",
    });
  };

  const setInvalidError = (message?: string) => {
    setError({
      message: message || "Failed to process authentication link",
      type: "invalid",
    });
  };

  const clearError = () => {
    setError({ message: "", type: null });
  };

  const resetForNewEmail = (email: string) => {
    if (currentEmail === email) {
      setUsedMagicLinks(new Set());
    }
    setCurrentEmail(email);
  };

  const resetAll = () => {
    setUsedMagicLinks(new Set());
    setCurrentEmail(null);
    clearError();
  };

  return {
    isLinkUsed,
    markLinkAsUsed,
    isLinkExpired,
    setExpiredError,
    setUsedError,
    setInvalidError,
    clearError,
    resetForNewEmail,
    resetAll,
    error,
  };
}
