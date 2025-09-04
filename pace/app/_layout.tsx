import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="home"
        options={{ drawerLabel: "Home", title: "Home" }}
      />
      <Drawer.Screen
        name="community"
        options={{ drawerLabel: "Community", title: "Community" }}
      />
      <Drawer.Screen
        name="block"
        options={{ drawerLabel: "Block", title: "Block" }}
      />
      <Drawer.Screen
        name="property"
        options={{ drawerLabel: "Property", title: "Property" }}
      />
      <Drawer.Screen
        name="tenant"
        options={{ drawerLabel: "Tenant", title: "Tenant" }}
      />
      <Drawer.Screen
        name="bills"
        options={{ drawerLabel: "Bills", title: "Bills" }}
      />
      <Drawer.Screen
        name="complaints"
        options={{ drawerLabel: "Complaints", title: "Complaints" }}
      />
    </Drawer>
  );
}