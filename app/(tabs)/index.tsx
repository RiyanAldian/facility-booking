// MenuScreen.tsx
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MenuScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Menu</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push("/(app)/facilities")}
      >
        <Text style={styles.menuText}> Facility List</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push("/(app)/bookings")}
      >
        <Text style={styles.menuText}> My Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push("/(app)/BookFacilityScreen")}
      >
        <Text style={styles.menuText}>Book Facility</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  menuButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  menuText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
