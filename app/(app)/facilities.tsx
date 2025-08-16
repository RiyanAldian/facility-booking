import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Searchbar, Surface, Text } from "react-native-paper";
import { FacilityItem } from "../../components/FacilityItem";

async function fetchFacilities(search: string) {
  try {
    const token = await SecureStore.getItemAsync("accessToken");

    const url = new URL("https://booking-api.hyge.web.id/facilities");
    if (search) {
      url.searchParams.append("search", search);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch facilities: ${res.status}`);
    }

    return await res.json();
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
    <Surface style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          padding: 16,
          textAlign: "center",
        }}
      >
        Daftar Fasilitas
      </Text>
      {/* Search Bar */}
      <Searchbar
        placeholder="Cari fasilitas..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 12 }}
      />

      {/* Facilities List */}
      <FlatList
        data={query.data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FacilityItem
            facility={item}
            onPress={() => router.push(`/(app)/facilities/${item.id}`)}
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
            <Text style={{ padding: 16, textAlign: "center" }}>
              Tidak ada data
            </Text>
          ) : null
        }
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 16,
        }}
      />
    </Surface>
  );
}
