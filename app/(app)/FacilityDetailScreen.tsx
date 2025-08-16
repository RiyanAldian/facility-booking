import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../lib/api";

export default function FacilityDetailScreen() {
  const route = useRoute();
  const { id } = route.params as { id: string };

  const [facility, setFacility] = useState<any>(null);
  const [loadingFacility, setLoadingFacility] = useState(true);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [availability, setAvailability] = useState<any[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    fetchFacility();
  }, []);

  useEffect(() => {
    fetchAvailability(date);
  }, [date]);

  async function fetchFacility() {
    try {
      setLoadingFacility(true);
      const res = await api.get(`/facilities/${id}`);
      const data = res.data;
      setFacility(data);
    } catch (error) {
      console.error("Error fetching facility:", error);
    } finally {
      setLoadingFacility(false);
    }
  }

  async function fetchAvailability(selectedDate: Date) {
    try {
      setLoadingAvailability(true);
      const dateStr = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      const res = await api.get(`/facilities/${id}/availability/daily`, {
        params: { date: dateStr },
      });
      setAvailability(res.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoadingAvailability(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Facility Info */}
      {loadingFacility ? (
        <ActivityIndicator />
      ) : facility ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {facility.name}
          </Text>
          <Text style={{ marginVertical: 8 }}>{facility.description}</Text>
          <Text>Capacity: {facility.capacity}</Text>
          <Text>Status: {facility.status}</Text>
        </>
      ) : (
        <Text>Failed to load facility.</Text>
      )}

      {/* Date Picker */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "#007bff",
          borderRadius: 8,
        }}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: "white" }}>Select Date</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(event, selected) => {
            setShowDatePicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      {/* Availability */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          Availability for {date.toISOString().split("T")[0]}
        </Text>

        {loadingAvailability ? (
          <ActivityIndicator style={{ marginTop: 10 }} />
        ) : (
          <FlatList
            data={availability}
            keyExtractor={(item) => item.time}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  backgroundColor: item.isFullyBooked ? "#f8d7da" : "#d4edda",
                  marginTop: 8,
                  borderRadius: 6,
                }}
              >
                <Text>
                  {item.time} —{" "}
                  {item.isFullyBooked ? "Fully Booked" : "Available"}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
