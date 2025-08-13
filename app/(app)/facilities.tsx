import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Button, FlatList, RefreshControl, Text, View } from "react-native";
import { FacilityItem } from "../../components/FacilityItem";
import { SearchBar } from "../../components/SearchBar";

async function fetchFacilities(search: string) {
  try {
    // Ambil token dari SecureStore
    const token = await SecureStore.getItemAsync("accessToken");

    // Buat URL dengan query params jika ada pencarian
    const url = new URL("https://booking-api.hyge.web.id/facilities");
    if (search) {
      url.searchParams.append("search", search);
    }

    // Fetch data
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    console.log("Status:", res.status, "OK?:", res.ok);
    if (!res.ok) {
      throw new Error(`Gagal fetch facilities: ${res.status}`);
    }

    const data = await res.json();
    console.log("Facilities data:", data);
    return data;
  } catch (err) {
    console.error("Error getFacilities:", err);
    return [];
  }
}

export default function FacilitiesScreen() {
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["facilities", search],
    queryFn: () => fetchFacilities(search),
  });

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Fasilitas</Text>
        <Button title="Profil" onPress={() => router.push("/(app)/profile")} />
      </View>

      <SearchBar value={search} onChange={setSearch} />

      <FlatList
        data={query.data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FacilityItem
            facility={item}
            // onPress={() => router.push(`/(app)/facilities/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={query.isFetching}
            onRefresh={() => query.refetch()}
          />
        }
        ListEmptyComponent={
          !query.isFetching ? (
            <Text style={{ padding: 16 }}>Tidak ada data</Text>
          ) : null
        }
      />
    </View>
  );
}
