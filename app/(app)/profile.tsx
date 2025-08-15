import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { updateProfile } from "../../lib/auth";
import { useAuthStore } from "../../lib/store";
import { ProfileSchema, profileSchema } from "../../lib/validation";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // console.log(user?.name);
  const logout = () => useAuthStore.getState().logout();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name, email: user?.email },
  });

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
    <View style={{ padding: 16, gap: 8 }}>
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

      <Text>Password (opsional, untuk ganti)</Text>
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
