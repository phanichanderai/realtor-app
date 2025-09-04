import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TextInput, Button,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API from "../Config/api";

interface Property {
  id: number;
  door_number: string;
  block: number;
}

interface Tenant {
  id: number;
  name: string;
  contact_number: string;
  email: string;
  move_in_date: string;
  property: number;
  property_details?: {
    door_number: string;
    block_name: string;
    community_name: string;
  };
}

export default function TenantPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await API.get("tenants/");
      setTenants(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch tenants");
    }
    setLoading(false);
  };

  const fetchProperties = async () => {
    try {
      const res = await API.get("properties/");
      setProperties(res.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch properties");
    }
  };

  useEffect(() => {
    fetchTenants();
    fetchProperties();
  }, []);

  const createTenant = async () => {
    if (!name || !contact || !email || !moveInDate || !propertyId) {
      Alert.alert("Validation", "All fields are required");
      return;
    }
    setCreating(true);
    try {
      await API.post("tenants/", {
        name,
        contact_number: contact,
        email,
        move_in_date: moveInDate,
        property: propertyId,
      });
      setName("");
      setContact("");
      setEmail("");
      setMoveInDate("");
      setPropertyId(null);
      fetchTenants();
    } catch (e) {
      Alert.alert("Error", "Could not create tenant");
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
          <Text style={styles.header}>Tenants</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={tenants}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.address}>Contact: {item.contact_number}</Text>
                  <Text style={styles.address}>Email: {item.email}</Text>
                  <Text style={styles.address}>Move-in: {item.move_in_date}</Text>
                  <Text style={styles.address}>
                    Property: {item.property_details?.community_name}, Block {item.property_details?.block_name}, Door {item.property_details?.door_number}
                  </Text>
                </View>
              )}
              ListEmptyComponent={<Text>No tenants found.</Text>}
            />
          )}
          <View style={styles.form}>
            <Text style={styles.formHeader}>Add Tenant</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Contact Number"
              value={contact}
              onChangeText={setContact}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Move-in Date (YYYY-MM-DD)"
              value={moveInDate}
              onChangeText={setMoveInDate}
              style={styles.input}
            />
            <View style={styles.pickerContainer}>
              <Text style={{ marginBottom: 4 }}>Select Property:</Text>
              <FlatList
                data={properties}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Button
                    title={item.door_number}
                    color={propertyId === item.id ? "#007AFF" : "#888"}
                    onPress={() => setPropertyId(item.id)}
                  />
                )}
                ListEmptyComponent={<Text>No properties available.</Text>}
                contentContainerStyle={{ gap: 8 }}
              />
            </View>
            <Button title={creating ? "Creating..." : "Create"} onPress={createTenant} disabled={creating} />
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