import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { logout, updateProfile } from "../../lib/auth";
import { useAuthStore } from "../../lib/store";

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name, email: user?.email },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data);
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
        onChangeText={(t) => setValue("name", t)}
        style={{ borderWidth: 1, padding: 10 }}
      />
      {errors.name && (
        <Text style={{ color: "red" }}>{errors.name.message as string}</Text>
      )}

      <Text>Email</Text>
      <TextInput
        {...register("email")}
        onChangeText={(t) => setValue("email", t)}
        style={{ borderWidth: 1, padding: 10 }}
      />
      {errors.email && (
        <Text style={{ color: "red" }}>{errors.email.message as string}</Text>
      )}

      <Text>Password (opsional, untuk ganti)</Text>
      <TextInput
        {...register("password")}
        onChangeText={(t) => setValue("password", t)}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10 }}
      />
      {errors.password && (
        <Text style={{ color: "red" }}>
          {errors.password.message as string}
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
