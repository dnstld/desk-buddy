import AsyncStorage from "@react-native-async-storage/async-storage";

export function useStorage() {
  async function setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async function getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async function removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  return {
    setItem,
    getItem,
    removeItem,
  };
}