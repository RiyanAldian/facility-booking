import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { login } from "../../lib/auth";
import { loginSchema, LoginSchema } from "../../lib/validation";

export default function LoginScreen() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    await login(data);
    router.replace("/(app)/facilities");
  };

  return (
    <View style={{ padding: 20, gap: 8 }}>
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
