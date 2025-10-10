import * as Linking from "expo-linking";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HeaderWithMenu from "../../components/HeaderWithMenu";

export default function DebugScreen() {
  const [urls, setUrls] = useState<string[]>([]);

  const generateUrls = () => {
    const authCallback = Linking.createURL("auth/callback");
    const testUrl = Linking.createURL("test");
    const rootUrl = Linking.createURL("");

    setUrls([
      `Auth Callback: ${authCallback}`,
      `Test URL: ${testUrl}`,
      `Root URL: ${rootUrl}`,
    ]);
  };

  const testDeepLink = () => {
    const testUrl = Linking.createURL(
      "auth/callback?access_token=test&refresh_token=test"
    );
    Alert.alert("Test URL", testUrl);
    Linking.openURL(testUrl);
  };

  return (
    <View style={styles.container}>
      <HeaderWithMenu title="Debug" />
      <View style={styles.content}>
        <Text style={styles.title}>Debug Deep Links</Text>

        <TouchableOpacity style={styles.button} onPress={generateUrls}>
          <Text style={styles.buttonText}>Generate URLs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testDeepLink}>
          <Text style={styles.buttonText}>Test Deep Link</Text>
        </TouchableOpacity>

        {urls.map((url, index) => (
          <Text key={index} style={styles.url}>
            {url}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  url: {
    fontSize: 12,
    marginBottom: 10,
    color: "#666",
  },
});
