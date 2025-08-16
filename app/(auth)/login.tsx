import { loginApi } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useAuthStore } from "../../lib/authStore";
import { loginSchema, LoginSchema } from "../../lib/validation";

export default function LoginScreen() {
  const theme = useTheme();

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
      await useAuthStore.getState().setAuth(res.accessToken, res.user);
      router.replace("../(tabs)");
    } catch {
      // Bisa pakai Snackbar atau Dialog dari Paper
      console.log("Login gagal");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Masuk
      </Text>

      <TextInput
        label="Email"
        mode="outlined"
        {...register("email")}
        onChangeText={(t) => setValue("email", t)}
        error={!!errors.email}
        style={styles.input}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        {...register("password")}
        onChangeText={(t) => setValue("password", t)}
        error={!!errors.password}
        style={styles.input}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        style={styles.button}
      >
        Login
      </Button>

      <Link
        href="/(auth)/register"
        style={{ textAlign: "center", marginTop: 8 }}
      >
        Belum punya akun? Daftar
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  title: {
    marginBottom: 24,
    fontWeight: "700",
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 4,
  },
});
