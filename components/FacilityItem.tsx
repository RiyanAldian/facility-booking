import { Pressable, Text, View } from "react-native";
import type { Facility } from "../lib/types";

export function FacilityItem({
  facility,
  onPress,
}: {
  facility: Facility;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ padding: 12, borderBottomWidth: 1 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{facility.name}</Text>
        {facility.description ? (
          <Text style={{ color: "#555" }}>{facility.description}</Text>
        ) : null}
        <Text>Status: {facility.status}</Text>
      </View>
    </Pressable>
  );
}
