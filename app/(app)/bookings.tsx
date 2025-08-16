import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, FlatList, SafeAreaView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Text,
} from "react-native-paper";
import api from "../../lib/api";
import { cancelBooking } from "../../lib/bookings";

export default function BookingListScreen() {
  const [status, setStatus] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["bookings", status, sortDirection, page],
    queryFn: async () => {
      const res = await api.get("/facilities/bookings/my", {
        params: {
          status: status || "booked",
          sortBy: "createdAt",
          sortDirection: sortDirection || "desc",
          page,
          pageSize,
        },
      });
      return res.data;
    },
  });

  const handleCancel = async (id: number) => {
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
              await cancelBooking(id);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", padding: 16 }}>
        My Booking
      </Text>
      {/* Konten */}
      <View style={{ flex: 1, padding: 16 }}>
        {/* Filter Section */}
        <Card style={{ padding: 12, marginBottom: 16 }}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Filter
          </Text>
          {/* Picker Status */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 6,
              marginBottom: 8,
            }}
          >
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
          </View>

          {/* Picker Sort */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 6,
            }}
          >
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
          </View>
        </Card>

        {/* Booking List */}
        {isLoading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={data?.bookings || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={{ marginBottom: 12 }}>
                <Card.Title
                  title={`Facility #${item.facilityId}`}
                  subtitle={`${new Date(item.bookingDate).toLocaleDateString(
                    "id-ID"
                  )} | ${item.startHour}:00 - ${item.endHour}:00`}
                  right={() =>
                    item.status === "booked" && (
                      <IconButton
                        icon="close"
                        iconColor="red"
                        onPress={() => handleCancel(item.id)}
                      />
                    )
                  }
                />
                <Card.Content>
                  <Text>Status: {item.status}</Text>
                  <Text>Catatan: {item.notes || "-"}</Text>
                </Card.Content>
              </Card>
            )}
          />
        )}

        {/* Pagination */}
        {!isLoading && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Button
              mode="outlined"
              onPress={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
            >
              Prev
            </Button>
            <Text variant="bodyMedium" style={{ alignSelf: "center" }}>
              Page {page} / {data?.totalPages || 1}
            </Text>
            <Button
              mode="outlined"
              onPress={() => setPage((p) => (data?.hasMore ? p + 1 : p))}
              disabled={!data?.hasMore}
            >
              Next
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
