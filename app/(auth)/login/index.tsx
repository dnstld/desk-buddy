import { useAuth } from "@/providers/AuthProvider";
import AuthMessage from "@/src/components/features/auth/auth-message";
import AuthPageWrapper from "@/src/components/features/auth/auth-page-wrapper";
import LoginForm from "@/src/components/features/auth/login-form";
import Logo from "@/src/components/features/auth/logo";
import { useStorage } from "@/src/shared/hooks/use-storage";
import { parseAuthError } from "@/src/shared/utils/auth-error-handler";
import {
  LoginFormData,
  VALIDATION_MESSAGES,
} from "@/src/shared/validations/login-validation";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginScreen(): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { getItem, setItem } = useStorage();

  const { signInWithOtp, authError, clearAuthError } = useAuth();
  const params = useLocalSearchParams();

  const form = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const { watch, reset } = form;
  const email = watch("email");

  // Prefill email from storage - only once on mount
  useEffect(() => {
    const loadSavedEmail = async () => {
      const savedEmail = await getItem("email");
      if (savedEmail) {
        form.setValue("email", savedEmail, { shouldValidate: true });
      }
    };
    loadSavedEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Handle URL error parameter
  useEffect(() => {
    if (params.error && typeof params.error === "string") {
      const errorMessage = params.error;
      const errorDisplay = parseAuthError(errorMessage);
      if (errorDisplay.waitTimeSeconds) {
        setCountdown(errorDisplay.waitTimeSeconds);
      }
      setCallbackError(errorMessage);
    }
  }, [params.error]);

  // Copy authError to callbackError so it persists even after authError is cleared
  useEffect(() => {
    if (authError) {
      setCallbackError(authError);
      const errorDisplay = parseAuthError(authError);
      if (errorDisplay.waitTimeSeconds) {
        setCountdown(errorDisplay.waitTimeSeconds);
      }
    }
  }, [authError]);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsSubmitting(true);
    setItem("email", data.email);

    try {
      await signInWithOtp(data.email);
      setEmailSent(true);
      setIsSubmitting(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : VALIDATION_MESSAGES.magicLinkFailed;

      console.error("[Login] Sign in error:", errorMessage);

      const errorDisplay = parseAuthError(errorMessage);
      if (errorDisplay.waitTimeSeconds) {
        setCountdown(errorDisplay.waitTimeSeconds);
      }

      setCallbackError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = (): void => {
    router.setParams({ error: undefined });
    setEmailSent(false);
    setCallbackError(null);
    clearAuthError();
    reset();
  };

  const displayError = callbackError || authError;
  const errorDisplay = displayError ? parseAuthError(displayError) : null;

  const isButtonDisabled = countdown > 0;
  const errorButtonTitle = isButtonDisabled
    ? `Get new link in ${countdown}s`
    : "Get new magic link";

  if (emailSent) {
    return (
      <AuthMessage
        variant="success"
        title="Magic link sent!"
        message="We've emailed a login link to"
        email={email}
        buttonLabel="Resend magic link"
        onButtonPress={handleTryAgain}
      />
    );
  }

  if (errorDisplay) {
    return (
      <AuthMessage
        variant="error"
        title={errorDisplay.title}
        message={errorDisplay.message}
        buttonLabel={errorButtonTitle}
        buttonDisabled={isButtonDisabled}
        onButtonPress={handleTryAgain}
      />
    );
  }

  return (
    <AuthPageWrapper>
      <Logo />
      <LoginForm form={form} isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </AuthPageWrapper>
  );
}
