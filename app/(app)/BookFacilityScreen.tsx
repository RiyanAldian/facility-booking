import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import api from "../../lib/api";

export default function BookFacilityScreen() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch facilities
  useEffect(() => {
    api.get("/facilities").then((res) => {
      setFacilities(res.data);
    });
  }, []);

  // Fetch daily availability when facility or date changes
  useEffect(() => {
    if (selectedFacility) {
      const dateStr = date.toISOString().split("T")[0];
      api
        .get(`/facilities/${selectedFacility}/availability`, {
          params: { date: dateStr },
        })
        .then((res) => {
          setAvailableHours(res.data.availableHours || []);
        });
    }
  }, [selectedFacility, date]);

  const handleSubmit = async () => {
    const today = new Date();
    if (date < new Date(today.setHours(0, 0, 0, 0))) {
      Alert.alert("Error", "Tidak bisa booking di masa lalu");
      return;
    }

    if (!selectedFacility || !selectedHour) {
      Alert.alert("Error", "Pilih facility dan jam mulai");
      return;
    }

    try {
      await api.post("/facilities/bookings", {
        facilityId: selectedFacility,
        bookingDate: date.toISOString().split("T")[0],
        startHour: parseInt(selectedHour),
        notes,
      });
      Alert.alert("Sukses", "Booking berhasil dibuat");
    } catch (err: any) {
      Alert.alert("Gagal", err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Pilih Facility</Text>
      <Picker
        selectedValue={selectedFacility}
        onValueChange={(val) => setSelectedFacility(val)}
      >
        <Picker.Item label="-- Pilih Facility --" value="" />
        {facilities.map((f: any) => (
          <Picker.Item key={f.id} label={f.name} value={f.id} />
        ))}
      </Picker>

      <Text>Pilih Tanggal</Text>
      <Button
        title={date.toDateString()}
        onPress={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
          minimumDate={new Date()} // tidak bisa pilih tanggal sebelum hari ini
        />
      )}

      <Text>Pilih Jam Mulai</Text>
      <Picker
        selectedValue={selectedHour}
        onValueChange={(val) => setSelectedHour(val)}
      >
        <Picker.Item label="-- Pilih Jam --" value="" />
        {availableHours.map((hour: number) => (
          <Picker.Item key={hour} label={`${hour}:00`} value={hour} />
        ))}
      </Picker>

      <Text>Catatan (Opsional)</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Masukkan catatan"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginVertical: 8,
        }}
      />

      <Button title="Booking" onPress={handleSubmit} />
    </View>
  );
}
