import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
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

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const res = await fetch("https://booking-api.hyge.web.id/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Registrasi gagal");
        return;
      }

      router.replace("/(auth)/login");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Daftar
      </Text>

      <TextInput
        label="Nama"
        mode="outlined"
        {...register("name")}
        onChangeText={(t) => setValue("name", t)}
        error={!!errors.name}
      />
      <HelperText type="error" visible={!!errors.name}>
        {errors.name?.message}
      </HelperText>

      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        {...register("email")}
        onChangeText={(t) => setValue("email", t)}
        error={!!errors.email}
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email?.message}
      </HelperText>

      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        {...register("password")}
        onChangeText={(t) => setValue("password", t)}
        error={!!errors.password}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password?.message}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        style={styles.button}
      >
        Register
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 100,
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  button: {
    marginTop: 12,
    paddingVertical: 6,
  },
});
