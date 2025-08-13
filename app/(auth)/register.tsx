import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { useAuthStore } from "../../lib/authStore";
import { registerSchema, RegisterSchema } from "../../lib/validation";

export default function RegisterScreen() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const { login } = useAuthStore();

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const res = await fetch("https://booking-api.hyge.web.id/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        redirect: "follow",
      });
      console.log(res);
      if (!res.ok) {
        const err = await res.json();

        alert(err.message || "Registrasi gagal");
        return;
      }

      const result = await res.json();
      console.log("Register success:", result);

      // Simpan token jika ada
      if (result?.accessToken) {
        await login(result.email, result.password);
      }

      // Pindah ke halaman facilities
      router.replace("/(app)/facilities");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <View style={{ padding: 20, gap: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Daftar</Text>
      <Text>Nama</Text>
      <TextInput
        {...register("name")}
        onChangeText={(t) => setValue("name", t)}
        style={{ borderWidth: 1, padding: 10 }}
      />
      {errors.name && (
        <Text style={{ color: "red" }}>{errors.name.message}</Text>
      )}

      <Text>Email</Text>
      <TextInput
        {...register("email")}
        onChangeText={(t) => setValue("email", t)}
        style={{ borderWidth: 1, padding: 10 }}
      />
      {errors.email && (
        <Text style={{ color: "red" }}>{errors.email.message}</Text>
      )}

      <Text>Password</Text>
      <TextInput
        {...register("password")}
        onChangeText={(t) => setValue("password", t)}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10 }}
      />
      {errors.password && (
        <Text style={{ color: "red" }}>{errors.password.message}</Text>
      )}

      <Button
        title={isSubmitting ? "Memproses…" : "Register"}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
