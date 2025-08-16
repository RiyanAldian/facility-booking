import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  List,
  Paragraph,
  Text,
  Title,
} from "react-native-paper";
import api from "../../../lib/api";

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
      setFacility(res.data);
    } catch (error) {
      console.error("Error fetching facility:", error);
    } finally {
      setLoadingFacility(false);
    }
  }

  async function fetchAvailability(selectedDate: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(selectedDate);
    dateToCheck.setHours(0, 0, 0, 0);

    if (dateToCheck < today) {
      setAvailability([]);
      return;
    }

    try {
      setLoadingAvailability(true);
      const todayStr = dayjs(selectedDate).format("YYYY-MM-DD");
      const res = await api.get(`/facilities/${id}/availability/daily`, {
        params: { date: todayStr },
      });
      setAvailability(res.data?.timeSlots || []);
    } catch {
      setAvailability([]);
    } finally {
      setLoadingAvailability(false);
    }
  }

  return (
    <>
      {/* Facility Info */}
      {loadingFacility ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : facility ? (
        <Card style={{ margin: 16 }}>
          <Card.Content>
            <Title>{facility.name}</Title>
            <Paragraph>{facility.description}</Paragraph>
            <Text>Capacity: {facility.maxCapacity}</Text>
            <Text>Status: {facility.status}</Text>
          </Card.Content>
        </Card>
      ) : (
        <Text style={{ margin: 16 }}>Failed to load facility.</Text>
      )}

      {/* Date Picker */}
      <Button
        mode="contained"
        style={{ marginHorizontal: 16, marginBottom: 8 }}
        onPress={() => setShowDatePicker(true)}
      >
        Select Date
      </Button>

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
      <Card style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <Card.Title
          title={`Availability for ${dayjs(date).format("YYYY-MM-DD")}`}
        />
        <Card.Content style={{ maxHeight: 400 }}>
          <ScrollView>
            {loadingAvailability ? (
              <ActivityIndicator />
            ) : availability.length > 0 ? (
              availability.map((item) => (
                <List.Item
                  key={item.startTime}
                  title={`${item.startTime} - ${item.endTime}`}
                  description={`${
                    item.available ? "Available" : "Fully Booked"
                  } (${item.currentBookings}/${item.maxCapacity})`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={item.available ? "check-circle" : "close-circle"}
                      color={item.available ? "green" : "red"}
                    />
                  )}
                />
              ))
            ) : (
              <Text>No time slots available</Text>
            )}
          </ScrollView>
        </Card.Content>
      </Card>
    </>
  );
}
