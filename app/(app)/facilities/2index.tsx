import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Button, FlatList, RefreshControl, Text, View } from "react-native";
import { FacilityItem } from "../../../components/FacilityItem";
import { SearchBar } from "../../../components/SearchBar";
import api from "../../../lib/api";
import type { Facility } from "../../../lib/types";

async function fetchFacilities(search: string) {
  const res = await api.get<Facility[]>(`/facilities`, {
    params: { search: search || undefined },
  });
  return res.data;
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
