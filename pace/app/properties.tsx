import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TextInput, Button,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API from "../Config/api";

interface Block {
  id: number;
  name: string;
  community: number;
}

interface Property {
  id: number;
  door_number: string;
  is_occupied: boolean;
  block: number;
  block_name?: string;
}

export default function PropertyPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [doorNumber, setDoorNumber] = useState("");
  const [blockId, setBlockId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await API.get("properties/");
      setProperties(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch properties");
    }
    setLoading(false);
  };

  const fetchBlocks = async () => {
    try {
      const res = await API.get("blocks/");
      setBlocks(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch blocks");
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchBlocks();
  }, []);

  const createProperty = async () => {
    if (!doorNumber || !blockId) {
      Alert.alert("Validation", "Door number and block are required");
      return;
    }
    setCreating(true);
    try {
      await API.post("properties/", { door_number: doorNumber, block: blockId });
      setDoorNumber("");
      setBlockId(null);
      fetchProperties();
    } catch (e) {
      Alert.alert("Error", "Could not create property");
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
          <Text style={styles.header}>Properties</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={properties}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>Door: {item.door_number}</Text>
                  <Text style={styles.address}>
                    Block: {item.block_name || blocks.find(b => b.id === item.block)?.name || "Unknown"}
                  </Text>
                  <Text style={styles.address}>
                    Status: {item.is_occupied ? "Occupied" : "Vacant"}
                  </Text>
                </View>
              )}
              ListEmptyComponent={<Text>No properties found.</Text>}
            />
          )}
          <View style={styles.form}>
            <Text style={styles.formHeader}>Add Property</Text>
            <TextInput
              placeholder="Door Number"
              value={doorNumber}
              onChangeText={setDoorNumber}
              style={styles.input}
            />
            <View style={styles.pickerContainer}>
              <Text style={{ marginBottom: 4 }}>Select Block:</Text>
              <FlatList
                data={blocks}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Button
                    title={item.name}
                    color={blockId === item.id ? "#007AFF" : "#888"}
                    onPress={() => setBlockId(item.id)}
                  />
                )}
                ListEmptyComponent={<Text>No blocks available.</Text>}
                contentContainerStyle={{ gap: 8 }}
              />
            </View>
            <Button title={creating ? "Creating..." : "Create"} onPress={createProperty} disabled={creating} />
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