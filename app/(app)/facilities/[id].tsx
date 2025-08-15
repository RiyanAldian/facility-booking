import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../../lib/api"; // axios instance

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
    const today = new Date();
    // reset jam, menit, detik untuk perbandingan
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(selectedDate);
    dateToCheck.setHours(0, 0, 0, 0);

    if (dateToCheck < today) {
      console.warn("Cannot fetch availability for past dates");
      setAvailability([]);
      return;
    }

    try {
      setLoadingAvailability(true);
      const dateStr = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      const today = dayjs().format(dateStr);
      const res = await api.get(`/facilities/${id}/availability/daily`, {
        params: { date: today },
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
          <Text>Capacity: {facility.maxCapacity}</Text>
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
          onChange={(_, selected) => {
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

        {!loadingAvailability && availability.timeSlots?.length > 0 ? (
          <FlatList
            data={availability.timeSlots}
            keyExtractor={(item) => item.startTime}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  backgroundColor: item.available ? "#d4edda" : "#f8d7da",
                  marginTop: 8,
                  borderRadius: 6,
                }}
              >
                <Text>
                  {item.startTime} - {item.endTime} —{" "}
                  {item.available ? "Available" : "Fully Booked"} (
                  {item.currentBookings}/{item.maxCapacity})
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={{ marginTop: 10 }}>No time slots available</Text>
        )}
      </View>
    </View>
  );
}
