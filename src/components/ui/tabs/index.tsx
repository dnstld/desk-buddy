import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  hasError?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export interface TabsRef {
  setActiveTab: (tabId: string) => void;
}

const Tabs = forwardRef<TabsRef, TabsProps>(({ tabs, defaultTab }, ref) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  useImperativeHandle(ref, () => ({
    setActiveTab,
  }));

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <View className="flex-1">
      {/* Tab Headers */}
      <View className="flex-row border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-4 px-6 border-b-2 flex-row items-center justify-center
              ${activeTab === tab.id ? "border-primary" : "border-transparent"}
            `.trim()}
          >
            <Text
              className={`
                text-center font-semibold text-base
                ${activeTab === tab.id ? "text-primary" : "text-gray-500"}
              `.trim()}
            >
              {tab.label}
            </Text>
            {tab.hasError && activeTab !== tab.id && (
              <View className="ml-2 w-2 h-2 rounded-full bg-error" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View className="flex-1">{activeTabContent}</View>
    </View>
  );
});

Tabs.displayName = "Tabs";

export default Tabs;
