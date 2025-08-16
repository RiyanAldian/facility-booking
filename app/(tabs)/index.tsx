// MenuScreen.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, useTheme } from "react-native-paper";

export default function MenuScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Button
            mode="contained"
            icon={() => (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={26}
                color="white"
              />
            )}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            style={styles.menuButton}
            onPress={() => router.push("/(app)/facilities")}
          >
            Facility List
          </Button>

          <Button
            mode="contained"
            icon={() => (
              <MaterialCommunityIcons
                name="calendar-check"
                size={26}
                color="white"
              />
            )}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            style={styles.menuButton}
            onPress={() => router.push("/(app)/bookings")}
          >
            My Bookings
          </Button>

          <Button
            mode="contained"
            icon={() => (
              <MaterialCommunityIcons
                name="plus-circle"
                size={26}
                color="white"
              />
            )}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            style={styles.menuButton}
            onPress={() => router.push("/(app)/BookFacilityScreen")}
          >
            Book Facility
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "bold",
  },
  card: {
    paddingVertical: 20,
    borderRadius: 16,
  },
  menuButton: {
    marginBottom: 16,
    borderRadius: 12,
  },
  buttonContent: {
    height: 60,
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: "600",
  },
});
