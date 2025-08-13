import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { login } from "../lib/authSevices";
import { loginSchema, LoginSchemaType } from "../lib/validation";

export default function LoginScreen() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login(data.email, data.password);
      alert("Login sukses!");
    } catch (err) {
      alert("Login gagal");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        {...register("email")}
        onChangeText={(t) => setValue("email", t)}
        style={{ borderWidth: 1, marginBottom: 5 }}
      />
      {errors.email && (
        <Text style={{ color: "red" }}>{errors.email.message}</Text>
      )}

      <Text>Password</Text>
      <TextInput
        {...register("password")}
        onChangeText={(t) => setValue("password", t)}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 5 }}
      />
      {errors.password && (
        <Text style={{ color: "red" }}>{errors.password.message}</Text>
      )}

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
