import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text, TextInput } from "react-native-paper";
import { updateProfile } from "../../lib/auth";
import { useAuthStore } from "../../lib/authStore";
import { ProfileSchema, profileSchema } from "../../lib/validation";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const logout = () => {
    useAuthStore.getState().logout();
    router.replace("../(auth)/login");
  };

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileSchema) => {
    try {
      await updateProfile(data);
      setUser({ ...user, name: data.name });
      Alert.alert("Berhasil", "Profil diperbarui");
    } catch (e) {
      Alert.alert("Gagal", "Tidak bisa memperbarui profil");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Bagian Data Profil */}
      <Card style={styles.card}>
        <Card.Title title="Informasi Profil" />
        <Card.Content>
          <TextInput
            label="Nama"
            mode="outlined"
            {...register("name")}
            defaultValue={user?.name || ""}
            onChangeText={(t) => setValue("name", t)}
            error={!!errors.name}
          />
          {errors.name && (
            <Text style={styles.errorText}>
              {errors.name.message as string}
            </Text>
          )}

          <TextInput
            label="Email"
            mode="outlined"
            value={user?.email || ""}
            editable={false}
          />
        </Card.Content>
      </Card>

      {/* Bagian Password */}
      <Card style={styles.card}>
        <Card.Title title="Ubah Password" />
        <Card.Content>
          <TextInput
            label="Password Saat Ini"
            mode="outlined"
            {...register("currentPassword")}
            secureTextEntry
            onChangeText={(t) => setValue("currentPassword", t)}
          />

          <TextInput
            label="Password Baru"
            mode="outlined"
            {...register("newPassword")}
            secureTextEntry
            onChangeText={(t) => setValue("newPassword", t)}
            error={!!errors.newPassword}
            style={{ marginTop: 8 }}
          />
          {errors.newPassword && (
            <Text style={styles.errorText}>
              {errors.newPassword.message as string}
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Tombol Aksi */}
      <View style={{ marginTop: 16 }}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        >
          Simpan
        </Button>
        <Divider style={{ marginVertical: 8 }} />
        <Button mode="outlined" onPress={logout} textColor="red">
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  card: {
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});
