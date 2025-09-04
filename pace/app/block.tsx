import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TextInput, Button,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API from "../Config/api";

interface Community {
  id: number;
  name: string;
}

interface Block {
  id: number;
  name: string;
  community: number;
  community_name?: string;
}

export default function BlockPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await API.get("blocks/");
      setBlocks(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch blocks");
    }
    setLoading(false);
  };

  const fetchCommunities = async () => {
    try {
      const res = await API.get("communities/");
      setCommunities(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch communities");
    }
  };

  useEffect(() => {
    fetchBlocks();
    fetchCommunities();
  }, []);

  const createBlock = async () => {
    if (!name || !communityId) {
      Alert.alert("Validation", "Block name and community are required");
      return;
    }
    setCreating(true);
    try {
      await API.post("blocks/", { name, community: communityId });
      setName("");
      setCommunityId(null);
      fetchBlocks();
    } catch (e) {
      Alert.alert("Error", "Could not create block");
    }
    setCreating(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={styles.header}>Blocks</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={blocks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.address}>
                    Community: {item.community_name || 
                      communities.find(c => c.id === item.community)?.name || "Unknown"}
                  </Text>
                </View>
              )}
              ListEmptyComponent={<Text>No blocks found.</Text>}
            />
          )}
          <View style={styles.form}>
            <Text style={styles.formHeader}>Add Block</Text>
            <TextInput
              placeholder="Block Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <View style={styles.pickerContainer}>
              <Text style={{ marginBottom: 4 }}>Select Community:</Text>
              <FlatList
                data={communities}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Button
                    title={item.name}
                    color={communityId === item.id ? "#007AFF" : "#888"}
                    onPress={() => setCommunityId(item.id)}
                  />
                )}
                ListEmptyComponent={<Text>No communities available.</Text>}
                contentContainerStyle={{ gap: 8 }}
              />
            </View>
            <Button title={creating ? "Creating..." : "Create"} onPress={createBlock} disabled={creating} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  item: { marginBottom: 12, padding: 12, backgroundColor: "#e6e6e6", borderRadius: 8 },
  name: { fontSize: 18, fontWeight: "bold" },
  address: { fontSize: 14, color: "#555" },
  form: { marginTop: 24, padding: 12, backgroundColor: "#fff", borderRadius: 8, elevation: 2 },
  formHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginBottom: 8, backgroundColor: "#fff" },
  pickerContainer: { marginBottom: 12 },
});