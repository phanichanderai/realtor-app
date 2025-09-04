import { View, Text } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f9f9f9" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
        Tenant Home Screen
      </Text>
      <Text style={{ fontSize: 16, color: "#555", marginBottom: 24 }}>
        by Phani, on progress
      </Text>
      <Text style={{ fontSize: 14, color: "#888" }}>
        Working on it
      </Text>
      <Text style={{ fontSize: 14, color: "#888", marginTop: 32 }}>
        Built and managed by Phani Chander
      </Text>
    </View>
  );
}