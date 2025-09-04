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

interface Bill {
  id: number;
  bill_type: string;
  amount: string;
  due_date: string;
  status: string;
  tenant: number;
  tenant_name?: string;
  description?: string;
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [billType, setBillType] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await API.get("bills/");
      setBills(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch bills");
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
    fetchBills();
    fetchTenants();
  }, []);

  const createBill = async () => {
    if (!billType || !amount || !dueDate || !tenantId) {
      Alert.alert("Validation", "All fields except description are required");
      return;
    }
    setCreating(true);
    try {
      await API.post("bills/", {
        bill_type: billType,
        amount,
        due_date: dueDate,
        status,
        tenant: tenantId,
        description,
      });
      setBillType("");
      setAmount("");
      setDueDate("");
      setStatus("pending");
      setTenantId(null);
      setDescription("");
      fetchBills();
    } catch (e) {
      Alert.alert("Error", "Could not create bill");
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
          <Text style={styles.header}>Bills</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={bills}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>{item.bill_type} - ${item.amount}</Text>
                  <Text style={styles.address}>Tenant: {item.tenant_name || tenants.find(t => t.id === item.tenant)?.name || "Unknown"}</Text>
                  <Text style={styles.address}>Due: {item.due_date}</Text>
                  <Text style={styles.address}>Status: {item.status}</Text>
                  {item.description ? <Text style={styles.address}>Note: {item.description}</Text> : null}
                </View>
              )}
              ListEmptyComponent={<Text>No bills found.</Text>}
            />
          )}
          <View style={styles.form}>
            <Text style={styles.formHeader}>Add Bill</Text>
            <TextInput
              placeholder="Bill Type (rent, maintenance, utility, other)"
              value={billType}
              onChangeText={setBillType}
              style={styles.input}
            />
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Due Date (YYYY-MM-DD)"
              value={dueDate}
              onChangeText={setDueDate}
              style={styles.input}
            />
            <TextInput
              placeholder="Description (optional)"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
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
            <Button title={creating ? "Creating..." : "Create"} onPress={createBill} disabled={creating} />
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