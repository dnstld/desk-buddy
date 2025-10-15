import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { getErrorMessage } from "../../src/utils/error-handler";
import { logger } from "../../src/utils/logger";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signInWithOtp, clearAuthError } = useAuth();

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    clearAuthError(); // Clear any previous auth errors

    try {
      await signInWithOtp(email);
      setEmailSent(true);
      Alert.alert(
        "Check your email!",
        `We've sent a magic link to ${email}. Click the link in your email to sign in.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to send magic link");
      logger.error("Sign in error:", error);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail("");
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a magic link to {email}
          </Text>
          <Text style={styles.description}>
            Click the link in your email to sign in. The email may take a few
            minutes to arrive.
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleTryAgain}
          >
            <Text style={styles.secondaryButtonText}>Try Different Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Desk Buddy</Text>
        <Text style={styles.subtitle}>Sign in with your email</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Send Magic Link</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.helpText}>
          We&apos;ll send you a secure link to sign in without a password
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
  helpText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    lineHeight: 20,
  },
});
