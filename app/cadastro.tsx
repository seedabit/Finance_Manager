import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function App() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
            display_name: name,
        }
      }
    });
    setLoading(false);

    if (error) {
      Alert.alert("Erro no Cadastro", error.message);
    } else {
      Alert.alert(
        "Sucesso",
        "Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.",
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("Usuário já autenticado:", session.user);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)");
      }
    });
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo2.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.subtitle}>
        <Text style={[styles.h2, { color: "#000" }]}>Todas suas finanças</Text>

        <Text style={[styles.h2, { color: "#4C86A8" }]}>Num lugar só.</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formWrapper}
      >
        <View style={styles.form}>
          <Text style={styles.h4}>Cadastre-se no app.</Text>

          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Senha:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.buttonForm}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonTextForm}>Cadastrar-se</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 90,
    resizeMode: "contain",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    flexDirection: "row",
  },
  subtitle: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  h1: {
    fontSize: 64,
    fontWeight: "bold",
    lineHeight: 80,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  h4: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 24,
  },
  formWrapper: {
    width: "100%",
    marginTop: 20,
    marginBottom: 40,
  },
  form: {
    width: "100%",
    gap: 16,
    flexDirection: "column",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 16,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#D9D9D9",
    borderRadius: 32,
    paddingHorizontal: 20,
    opacity: 0.5,
  },
  buttonForm: {
    width: "100%",
    height: 58,
    backgroundColor: "#2374AB",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#2374AB",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonTextForm: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
