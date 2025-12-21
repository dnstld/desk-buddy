export const ANIMATION_CONFIG = {
  spring: {
    damping: 30,
    stiffness: 150,
  },
} as const;

export const ANIMATION_VALUES = {
  slideDistance: 300,
  
  slideOutDelay: 300,
  slideInDelay: 200,
  
  hidden: {
    translateY: 300,
    opacity: 0,
  },
  visible: {
    translateY: 0,
    opacity: 1,
  },
  message: {
    hidden: {
      translateY: 600, // Start from further down for slide up effect
      opacity: 0,
    },
    visible: {
      translateY: 0,
      opacity: 1,
    },
  },
} as const;

export const ANIMATION_DELAYS = {
  authError: 3000,
  stateTransition: 200,
  formReset: 300,
} as const;
