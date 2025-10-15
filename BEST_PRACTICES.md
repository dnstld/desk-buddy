# Best Practices Guide - Desk Buddy

## 📋 Table of Contents

1. [Logging](#logging)
2. [Error Handling](#error-handling)
3. [Type Safety](#type-safety)
4. [Constants & Configuration](#constants--configuration)
5. [Navigation](#navigation)
6. [Component Patterns](#component-patterns)

---

## 🔍 Logging

### ✅ DO: Use the Logger Utility

```typescript
import { logger } from "@/src/utils/logger";

// Info logging (dev only)
logger.info("User action", { userId, action });

// Error logging (always shown)
logger.error("Operation failed", error);

// Success logging (dev only)
logger.success("Data saved successfully");

// Debug logging (dev only)
logger.debug("API response:", data);

// Warning logging (dev only)
logger.warn("Deprecated method used");
```

### ❌ DON'T: Use console.log Directly

```typescript
// ❌ Bad
console.log("User logged in");
console.error("Error:", error);

// ✅ Good
logger.info("User logged in");
logger.error("Error:", error);
```

### Why?

- Logger automatically removes logs in production builds
- Consistent formatting with emoji prefixes
- Better log categorization
- Easier to find and filter logs

---

## 🚨 Error Handling

### ✅ DO: Use Error Handler Utility

```typescript
import { getErrorMessage, isAuthError } from "@/src/utils/error-handler";

try {
  await fetchData();
} catch (error) {
  // Extract user-friendly message
  const message = getErrorMessage(error, "Failed to fetch data");

  // Check error type
  if (isAuthError(error)) {
    // Handle auth errors
    router.replace("/(auth)/login");
  }

  // Show to user
  showToast(message);

  // Log for debugging
  logger.error("Fetch error:", error);
}
```

### ❌ DON'T: Use Inconsistent Error Handling

```typescript
// ❌ Bad
} catch (error: any) {
  Alert.alert("Error", error.message || "Something went wrong");
}

// ✅ Good
} catch (error) {
  const message = getErrorMessage(error, "Something went wrong");
  Alert.alert("Error", message);
}
```

### Error Handler Methods

- `getErrorMessage(error, fallback)` - Extracts user-friendly message
- `isError(error)` - Type guard for Error instances
- `isNetworkError(error)` - Checks for network errors
- `isAuthError(error)` - Checks for auth errors

---

## 🔒 Type Safety

### ✅ DO: Define Proper Types

```typescript
// Define specific interfaces
interface SeatData {
  seatCount: number;
  seatsPerPage: number;
  totalPages: number;
  hasMultiplePages: boolean;
}

// Use proper event types
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  // Type-safe access
  const x = event.nativeEvent.contentOffset.x;
};
```

### ❌ DON'T: Use 'any' Type

```typescript
// ❌ Bad
const processSeat = (index: number): any => {
  // ...
};

// ✅ Good
interface SeatInfo {
  seat: Seat;
  isOccupied: boolean;
  user?: User;
  seatIndex: number;
}

const processSeat = (index: number): SeatInfo | null => {
  // ...
};
```

### Type Aliases for Clarity

```typescript
// When type names conflict with component names
import { Seat as SeatType } from "@/src/types/room";
import Seat from "@/src/components/seat";
```

---

## ⚙️ Constants & Configuration

### ✅ DO: Use Centralized Constants

```typescript
import { TIMEOUTS, SEATS_CONFIG, VALIDATION } from "@/src/constants/config";

// Timeouts
setTimeout(() => {
  handleTimeout();
}, TIMEOUTS.AUTH_LOADING); // 10 seconds

// Seat configuration
const seatsPerPage = meeting
  ? SEATS_CONFIG.PER_PAGE.MEETING // 8
  : SEATS_CONFIG.PER_PAGE.WORKSPACE; // 12

// Validation
if (totalSeats > SEATS_CONFIG.MAX) {
  throw new Error(`Max ${SEATS_CONFIG.MAX} seats allowed`);
}
```

### ❌ DON'T: Use Magic Numbers

```typescript
// ❌ Bad
const seatsPerPage = meeting ? 8 : 12;
setTimeout(() => {}, 10000);
if (totalSeats > 120) {
}

// ✅ Good
const seatsPerPage = meeting
  ? SEATS_CONFIG.PER_PAGE.MEETING
  : SEATS_CONFIG.PER_PAGE.WORKSPACE;
setTimeout(() => {}, TIMEOUTS.AUTH_LOADING);
if (totalSeats > SEATS_CONFIG.MAX) {
}
```

### Available Constants

```typescript
// Seats configuration
SEATS_CONFIG.PER_PAGE.MEETING; // 8
SEATS_CONFIG.PER_PAGE.WORKSPACE; // 12
SEATS_CONFIG.MIN; // 1
SEATS_CONFIG.MAX; // 120

// Timeouts (milliseconds)
TIMEOUTS.AUTH_LOADING; // 10000
TIMEOUTS.TOAST_DURATION; // 3000
TIMEOUTS.AUTH_ERROR_DELAY; // 2000
TIMEOUTS.SUCCESS_CALLBACK_DELAY; // 1500

// Floor configuration
FLOOR_CONFIG.MIN; // -5 (B5)
FLOOR_CONFIG.MAX; // 50

// Validation
VALIDATION.ROOM_NAME.MIN; // 1
VALIDATION.ROOM_NAME.MAX; // 50
VALIDATION.ROOM_DESCRIPTION.MAX; // 150
VALIDATION.MIN_MEETING_SEATS; // 2
```

---

## 🧭 Navigation

### Router Type Assertions

Due to Expo Router's strict typing, some type assertions are necessary:

```typescript
// Type assertion needed for dynamic routes
router.push("/(app)/rooms/create/" as any);
router.replace("/(app)/rooms" as any);

// Add comment explaining why
// Type assertion needed due to Expo Router's strict typing
router.push(`/(app)/rooms/edit/${id}` as any);
```

### Loading Timeouts

Always add timeout protection for auth screens:

```typescript
import { TIMEOUTS } from "@/src/constants/config";

useEffect(() => {
  const timeout = setTimeout(() => {
    if (loading && !session) {
      logger.warn("Auth loading timeout");
      router.replace("/(auth)/login");
    }
  }, TIMEOUTS.AUTH_LOADING);

  return () => clearTimeout(timeout);
}, [loading, session]);
```

---

## 🧩 Component Patterns

### Form Validation

```typescript
import { VALIDATION } from "@/src/constants/config";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(VALIDATION.ROOM_NAME.MIN, "Name is required")
    .max(
      VALIDATION.ROOM_NAME.MAX,
      `Max ${VALIDATION.ROOM_NAME.MAX} characters`
    ),
});
```

### Custom Hooks

```typescript
// Always define proper return types
interface UseRoomsReturn {
  rooms: RoomWithDetails[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRooms(): UseRoomsReturn {
  // Implementation
}
```

### Toast Notifications

```typescript
// Use custom hook pattern
const { visible, message, type, show, hide } = useToast();

// Show toast
show("Success!", "success");
show("Error occurred", "error");
```

---

## 🔐 Environment Variables

### Setup

1. Copy `.env.example` to `.env`
2. Fill in your values:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_REDIRECT_URL=https://your-production-url.com
```

### Usage

```typescript
// Always validate in critical files
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL");
}

// Use dynamic URLs for auth redirects
const redirectUrl = __DEV__
  ? Linking.createURL("/auth/callback")
  : (process.env.EXPO_PUBLIC_REDIRECT_URL || "") + "/auth/callback";
```

---

## 📚 Import Aliases

Use path aliases for cleaner imports:

```typescript
// ✅ Good
import { logger } from "@/src/utils/logger";
import { useRooms } from "@/src/hooks/use-rooms";
import Button from "@/src/components/ui/button";

// ❌ Avoid
import { logger } from "../../../utils/logger";
import { useRooms } from "../../hooks/use-rooms";
```

---

## 🧪 Testing Guidelines

### Unit Tests (To Be Added)

```typescript
// src/utils/__tests__/error-handler.test.ts
import { getErrorMessage } from "../error-handler";

describe("getErrorMessage", () => {
  it("extracts message from Error instance", () => {
    const error = new Error("Test error");
    expect(getErrorMessage(error, "Fallback")).toBe("Test error");
  });

  it("returns fallback for unknown errors", () => {
    expect(getErrorMessage(null, "Fallback")).toBe("Fallback");
  });
});
```

---

## ✨ Quick Reference

### Most Common Patterns

```typescript
// 1. Import utilities
import { logger } from "@/src/utils/logger";
import { getErrorMessage } from "@/src/utils/error-handler";
import { TIMEOUTS } from "@/src/constants/config";

// 2. Handle async operations
try {
  logger.info("Starting operation");
  const result = await asyncOperation();
  logger.success("Operation completed");
  return result;
} catch (error) {
  const message = getErrorMessage(error, "Operation failed");
  logger.error("Operation error:", error);
  showToast(message, "error");
  throw error;
}

// 3. Add loading timeout
useEffect(() => {
  const timeout = setTimeout(() => {
    if (loading) {
      logger.warn("Timeout reached");
      handleTimeout();
    }
  }, TIMEOUTS.AUTH_LOADING);

  return () => clearTimeout(timeout);
}, [loading]);
```

---

## 🚀 Performance Tips

1. **Use useMemo for expensive calculations**

   ```typescript
   const calculated = useMemo(() => {
     return expensiveOperation(data);
   }, [data]);
   ```

2. **Use useCallback for event handlers**

   ```typescript
   const handleClick = useCallback(() => {
     doSomething();
   }, [dependency]);
   ```

3. **Avoid inline functions in render**

   ```typescript
   // ❌ Bad
   <Button onPress={() => doSomething()} />

   // ✅ Good
   <Button onPress={handlePress} />
   ```

---

## 📝 Code Review Checklist

Before submitting PR, ensure:

- [ ] No `console.log` statements (use logger)
- [ ] No `any` types (define proper interfaces)
- [ ] No magic numbers (use constants)
- [ ] Error handling uses `getErrorMessage()`
- [ ] Loading states have timeouts
- [ ] Environment variables are validated
- [ ] Types are properly defined
- [ ] Comments explain complex logic
- [ ] No hardcoded URLs or tokens

---

**Last Updated:** Based on code review improvements
**Maintained By:** Development Team
