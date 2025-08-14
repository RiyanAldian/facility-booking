import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { loginApi } from "../../lib/auth";
import { useAuthStore } from "../../lib/authStore";
import { loginSchema, LoginSchema } from "../../lib/validation";

export default function LoginScreen() {
  const setAuth = useAuthStore((s) => s.setAuth);
  // console.log();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const res = await loginApi(data.email, data.password);
      // console.log(res.user);
      await useAuthStore.getState().setAuth(res.accessToken, res.user);
      router.replace("../(app)/facilities"); // Redirect ke home
    } catch {
      alert("Email atau password salah");
    }
  };

  return (
    <View style={{ padding: 40, gap: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Masuk</Text>
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
        title={isSubmitting ? "Memproses…" : "Login"}
        onPress={handleSubmit(onSubmit)}
      />
      <Link href="/(auth)/register">Belum punya akun? Daftar</Link>
    </View>
  );
}
