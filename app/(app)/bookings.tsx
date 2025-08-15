// app/(app)/bookings/index.tsx
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Text,
  View,
} from "react-native";
import api from "../../lib/api";

export default function BookingListScreen() {
  const [status, setStatus] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["bookings", status, sortDirection, page],
    queryFn: async () => {
      const res = await axios.get(
        "https://booking-api.hyge.web.id/facilities/bookings/my",
        {
          params: {
            status: status || "booked",
            sortBy: "createdAt",
            sortDirection: sortDirection || "desc",
            page: page || 1,
            pageSize: pageSize || 10,
          },
        }
      );
      return res.data;
    },
  });
  const cancelBooking = async (id: number) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/facilities/bookings/${id}`);
              Alert.alert("Success", "Booking cancelled.");
              refetch(); // ambil data terbaru
            } catch (err) {
              console.error("Error cancelling booking:", err);
              Alert.alert("Error", "Failed to cancel booking.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Filter Status */}
      <Picker
        selectedValue={status}
        onValueChange={(value) => {
          setStatus(value || undefined);
          setPage(1);
        }}
      >
        <Picker.Item label="All" value="" />
        <Picker.Item label="Booked" value="booked" />
        <Picker.Item label="Cancelled" value="cancelled" />
      </Picker>

      {/* Sort Direction */}
      <Picker
        selectedValue={sortDirection}
        onValueChange={(value) => {
          setSortDirection(value);
          setPage(1);
        }}
      >
        <Picker.Item label="Descending" value="desc" />
        <Picker.Item label="Ascending" value="asc" />
      </Picker>

      {/* Booking List */}
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={data.bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                Facility #{item.facilityId}
              </Text>
              <Text>
                {new Date(item.bookingDate).toLocaleDateString("id-ID")} |{" "}
                {item.startHour}:00 - {item.endHour}:00
              </Text>
              <Text>Status: {item.status}</Text>
              <Text>Catatan: {item.notes || "-"}</Text>
              <Button
                title="Cancel"
                color="red"
                onPress={() => cancelBooking(item.id)}
              />
            </View>
          )}
        />
      )}

      {/* Pagination */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          title="Prev"
          onPress={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1}
        />
        <Text>
          Page {page} / {data?.totalPages || 1}
        </Text>
        <Button
          title="Next"
          onPress={() => setPage((p) => (data?.hasMore ? p + 1 : p))}
          disabled={!data?.hasMore}
        />
      </View>
    </View>
  );
}
