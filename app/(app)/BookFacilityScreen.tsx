import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import api from "../../lib/api";

export default function BookFacilityScreen() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableHours, setAvailableHours] = useState<any[]>([]);
  const [selectedHour, setSelectedHour] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch facilities
  useEffect(() => {
    api.get("/facilities").then((res) => {
      setFacilities(res.data);
    });
  }, []);

  // Fetch daily availability
  useEffect(() => {
    if (!selectedFacility) return;
    const dateStr = date.toISOString().split("T")[0];
    api
      .get(`/facilities/${selectedFacility}/availability/daily`, {
        params: { date: dateStr, id: selectedFacility },
      })
      .then((res) => {
        setAvailableHours(res.data.timeSlots || []);
      });
  }, [selectedFacility, date]);

  const handleSubmit = async () => {
    const today = new Date();
    if (date < new Date(today.setHours(0, 0, 0, 0))) {
      alert("Tidak bisa booking di masa lalu");
      return;
    }
    if (!selectedFacility || !selectedHour) {
      alert("Pilih facility dan jam mulai");
      return;
    }
    try {
      await api.post("/facilities/bookings", {
        facilityId: selectedFacility,
        bookingDate: date.toISOString().split("T")[0],
        startHour: parseInt(selectedHour),
        notes,
      });
      alert("Booking berhasil dibuat");
      setDate(new Date());
      setSelectedHour("");
      setNotes("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f9f9f9" }}>
      <Card style={{ padding: 16 }}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
          Booking Fasilitas
        </Text>

        {/* Facility Picker */}
        <Text variant="labelLarge">Pilih Facility</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          <Picker
            selectedValue={selectedFacility}
            onValueChange={(val) => setSelectedFacility(val)}
          >
            <Picker.Item label="-- Pilih Facility --" value="" />
            {facilities.map((f) => (
              <Picker.Item key={f.id} label={f.name} value={f.id} />
            ))}
          </Picker>
        </View>

        {/* Date Picker */}
        <Text variant="labelLarge">Pilih Tanggal</Text>
        <Button
          mode="outlined"
          style={{ marginBottom: 12 }}
          onPress={() => setShowDatePicker(true)}
        >
          {date.toDateString()}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="calendar"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Hour Picker */}
        <Text variant="labelLarge">Pilih Jam Mulai</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          <Picker
            selectedValue={selectedHour}
            onValueChange={(val) => setSelectedHour(val)}
          >
            <Picker.Item label="-- Pilih Jam --" value="" />
            {availableHours.map((item, idx) => (
              <Picker.Item
                key={idx}
                label={`${item.hour}:00`}
                value={item.hour}
              />
            ))}
          </Picker>
        </View>

        {/* Notes */}
        <TextInput
          label="Catatan (Opsional)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          style={{ marginBottom: 16 }}
        />

        {/* Submit */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={{ paddingVertical: 6 }}
        >
          Booking
        </Button>
      </Card>
    </View>
  );
}
