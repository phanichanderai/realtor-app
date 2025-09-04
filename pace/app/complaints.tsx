import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TextInput, Button,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API from "../Config/api";

interface Tenant {
  id: number;
  name: string;
}

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  resolved_at?: string;
  tenant: number;
  tenant_name?: string;
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get("complaints/");
      setComplaints(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch complaints");
    }
    setLoading(false);
  };

  const fetchTenants = async () => {
    try {
      const res = await API.get("tenants/");
      setTenants(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch tenants");
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchTenants();
  }, []);

  const createComplaint = async () => {
    if (!title || !description || !tenantId) {
      Alert.alert("Validation", "Title, description, and tenant are required");
      return;
    }
    setCreating(true);
    try {
      await API.post("complaints/", {
        title,
        description,
        priority,
        tenant: tenantId,
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTenantId(null);
      fetchComplaints();
    } catch (e) {
      Alert.alert("Error", "Could not create complaint");
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
          <Text style={styles.header}>Maintenance Complaints</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={complaints}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.address}>Tenant: {item.tenant_name || tenants.find(t => t.id === item.tenant)?.name || "Unknown"}</Text>
                  <Text style={styles.address}>Status: {item.status}</Text>
                  <Text style={styles.address}>Priority: {item.priority}</Text>
                  <Text style={styles.address}>Created: {item.created_at}</Text>
                  {item.resolved_at && <Text style={styles.address}>Resolved: {item.resolved_at}</Text>}
                  <Text style={styles.address}>Description: {item.description}</Text>
                </View>
              )}
              ListEmptyComponent={<Text>No complaints found.</Text>}
            />
          )}
          <View style={styles.form}>
            <Text style={styles.formHeader}>Add Complaint</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              multiline
            />
            <View style={styles.pickerContainer}>
              <Text style={{ marginBottom: 4 }}>Priority:</Text>
              <FlatList
                data={["low", "medium", "high", "urgent"]}
                horizontal
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Button
                    title={item}
                    color={priority === item ? "#007AFF" : "#888"}
                    onPress={() => setPriority(item)}
                  />
                )}
                contentContainerStyle={{ gap: 8 }}
              />
            </View>
            <View style={styles.pickerContainer}>
              <Text style={{ marginBottom: 4 }}>Select Tenant:</Text>
              <FlatList
                data={tenants}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Button
                    title={item.name}
                    color={tenantId === item.id ? "#007AFF" : "#888"}
                    onPress={() => setTenantId(item.id)}
                  />
                )}
                ListEmptyComponent={<Text>No tenants available.</Text>}
                contentContainerStyle={{ gap: 8 }}
              />
            </View>
            <Button title={creating ? "Creating..." : "Create"} onPress={createComplaint} disabled={creating} />
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