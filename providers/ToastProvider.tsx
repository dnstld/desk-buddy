import Toast from "@/src/components/ui/toast";
import React, { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");
  const [duration, setDuration] = useState(3000);

  const showToast = useCallback(
    ({ message, type = "success", duration = 3000 }: ToastConfig) => {
      setMessage(message);
      setType(type);
      setDuration(duration);
      setVisible(true);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, duration = 3000) => {
      showToast({ message, type: "success", duration });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration = 3000) => {
      showToast({ message, type: "error", duration });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration = 3000) => {
      showToast({ message, type: "info", duration });
    },
    [showToast]
  );

  const handleHide = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showInfo,
      }}
    >
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        duration={duration}
        onHide={handleHide}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
