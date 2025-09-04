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
  address: string;
}

export default function Community() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const res = await API.get("communities/");
      setCommunities(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch communities");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const createCommunity = async () => {
    if (!name || !address) {
      Alert.alert("Validation", "Name and address are required");
      return;
    }
    setCreating(true);
    try {
      await API.post("communities/", { name, address });
      setName("");
      setAddress("");
      fetchCommunities();
    } catch (e) {
      Alert.alert("Error", "Could not create community");
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
          <Text style={styles.header}>Communities</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={communities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.address}>{item.address}</Text>
                </View>
              )}
              ListEmptyComponent={<Text>No communities found.</Text>}
            />
          )}
          <View style={styles.form}>
            <Text style={styles.formHeader}>Add Community</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
            <Button title={creating ? "Creating..." : "Create"} onPress={createCommunity} disabled={creating} />
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
});