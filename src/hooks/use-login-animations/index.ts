import {
    ANIMATION_CONFIG,
    ANIMATION_DELAYS,
    ANIMATION_VALUES,
} from "@/src/constants/animations";
import { useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export type AnimationState = "login" | "success" | "error";

/**
 * Custom hook to manage login screen animations
 * Handles coordinated animations between form, success, and error states
 * 
 * @param state - Current animation state
 * @returns Animation values and utility functions
 */
export function useLoginAnimations(state: AnimationState) {
  // Start message off-screen (below viewport)
  const messageTranslateY = useSharedValue<number>(SCREEN_HEIGHT);
  const messageOpacity = useSharedValue<number>(1); // Always fully opaque

  const formTranslateY = useSharedValue<number>(ANIMATION_VALUES.visible.translateY);
  const formOpacity = useSharedValue<number>(ANIMATION_VALUES.visible.opacity);

  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isManuallyAnimating = useRef(false);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    timeoutRefs.current = [];
  };

  const addTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay);
    timeoutRefs.current.push(timeout);
    return timeout;
  };

  useEffect(() => {
    if (isManuallyAnimating.current) {
      return;
    }

    if (state === "login") {
      // Form is visible
      formTranslateY.value = withSpring(
        ANIMATION_VALUES.visible.translateY,
        ANIMATION_CONFIG.spring
      );
      formOpacity.value = withSpring(
        ANIMATION_VALUES.visible.opacity,
        ANIMATION_CONFIG.spring
      );

      // Message is hidden below screen
      messageTranslateY.value = SCREEN_HEIGHT;
      // No opacity change - stays at 1
    } else {
      // Message slides up from bottom to cover screen
      messageTranslateY.value = withSpring(
        0, // Slide to top of screen
        {
          damping: 25,
          stiffness: 120,
        }
      );
      // No opacity animation - stays at 1

      // Form stays visible but will be behind the message
      // No animation needed - it just stays in place
    }
  }, [state, formTranslateY, formOpacity, messageTranslateY, messageOpacity]);

  useEffect(() => {
    return clearAllTimeouts;
  }, []);

  /**
   * Animates the login form out
   * Used before transitioning to success/error states
   */
  const animateFormOut = () => {
    // Form doesn't need to animate out anymore - it stays in place
    // The message will slide up over it
  };

  /**
   * Animates the login form in
   * Used when recovering from errors
   */
  const animateFormIn = () => {
    // Reset flag before animating so future useEffect runs work normally
    isManuallyAnimating.current = false;
    
    formTranslateY.value = withSpring(
      ANIMATION_VALUES.visible.translateY,
      ANIMATION_CONFIG.spring
    );
    formOpacity.value = withSpring(
      ANIMATION_VALUES.visible.opacity,
      ANIMATION_CONFIG.spring
    );
  };

  /**
   * Animates the message screen in from the bottom
   * Used when showing success/error states
   */
  const animateMessageIn = () => {
    messageTranslateY.value = withSpring(0, {
      damping: 25,
      stiffness: 120,
    });
    // No opacity animation
  };

  /**
   * Animates the message screen out (slides down)
   * Used when returning to login form
   */
  const animateMessageOut = (onComplete?: () => void) => {
    isManuallyAnimating.current = true;
    
    messageTranslateY.value = withSpring(
      SCREEN_HEIGHT,
      {
        damping: 25,
        stiffness: 120,
      }
    );
    // No opacity animation

    if (onComplete) {
      addTimeout(onComplete, ANIMATION_DELAYS.formReset);
    }
  };

  return {
    messageTranslateY,
    messageOpacity,
    formTranslateY,
    formOpacity,
    
    animateFormOut,
    animateFormIn,
    animateMessageIn,
    animateMessageOut,
    addTimeout,
    clearAllTimeouts,
  };
}
