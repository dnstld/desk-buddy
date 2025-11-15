import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";

/**
 * Performance Monitor Component
 *
 * Tracks and displays component render count.
 * Use this to verify that performance optimizations are working.
 *
 * @example
 * import PerformanceMonitor from "@/src/components/performance-monitor";
 *
 * function MyComponent() {
 *   return (
 *     <View>
 *       {__DEV__ && <PerformanceMonitor name="MyComponent" />}
 *       <Text>Content</Text>
 *     </View>
 *   );
 * }
 */

interface PerformanceMonitorProps {
  name: string;
  showInProduction?: boolean;
}

export default function PerformanceMonitor({
  name,
  showInProduction = false,
}: PerformanceMonitorProps) {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
  });

  // Only show in development unless explicitly enabled for production
  if (!__DEV__ && !showInProduction) {
    return null;
  }

  const renderRate =
    renderCount.current > 0
      ? ((Date.now() - startTime.current) / 1000 / renderCount.current).toFixed(
          2
        )
      : 0;

  return (
    <View className="bg-purple-900 p-2 rounded m-2 border border-purple-500">
      <Text className="text-purple-300 text-xs font-mono">
        🎯 {name}: {renderCount.current} renders
      </Text>
      <Text className="text-purple-400 text-xs font-mono">
        ⚡ Avg: {renderRate}s per render
      </Text>
    </View>
  );
}
