import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  return (
    <View style={{ padding: 12 }}>
      <TextInput
        placeholder="Cari fasilitas (contoh: gym)"
        value={text}
        onChangeText={(t) => {
          setText(t);
          onChange(t);
        }}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
    </View>
  );
}
