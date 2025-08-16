import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { updateProfile } from "../../lib/auth";
import { useAuthStore } from "../../lib/authStore";
import { ProfileSchema, profileSchema } from "../../lib/validation";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const logout = () => {
    useAuthStore.getState().logout();
    console.log();
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
      const res = await updateProfile(data);
      setUser(data);
      Alert.alert("Berhasil", "Profil diperbarui");
    } catch (e) {
      Alert.alert("Gagal", "Tidak bisa memperbarui profil");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Profil</Text>
      <Text>Nama</Text>
      <TextInput
        {...register("name")}
        defaultValue={user?.name || ""}
        onChangeText={(t) => setValue("name", t)}
        style={{ borderWidth: 1, padding: 10 }}
      />
      {errors.name && (
        <Text style={{ color: "red" }}>{errors.name.message as string}</Text>
      )}

      <Text>Email</Text>
      <TextInput
        {...register("email")}
        editable={false}
        onChangeText={(t) => setValue("email", t)}
        style={{ borderWidth: 1, padding: 10 }}
        value={user?.email}
      />
      {errors.email && (
        <Text style={{ color: "red" }}>{errors.email.message as string}</Text>
      )}

      <Text>Password</Text>
      <TextInput
        {...register("currentPassword")}
        onChangeText={(t) => setValue("currentPassword", t)}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10 }}
      />
      {errors.newPassword && (
        <Text style={{ color: "red" }}>
          {errors.newPassword.message as string}
        </Text>
      )}

      <Text>Password Baru</Text>
      <TextInput
        {...register("newPassword")}
        onChangeText={(t) => setValue("newPassword", t)}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10 }}
      />
      {errors.newPassword && (
        <Text style={{ color: "red" }}>
          {errors.newPassword.message as string}
        </Text>
      )}

      <Button
        title={isSubmitting ? "Menyimpan…" : "Simpan"}
        onPress={handleSubmit(onSubmit)}
      />
      <View style={{ height: 8 }} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 50,
    gap: 8,
  },
});
