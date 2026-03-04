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
  Image
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Erro no Login", error.message);
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
        <Image source={require("../assets/images/logo2.png")} style={styles.logo} />
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
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonTextForm}>
              {loading ? "Carregando..." : "Entrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={{ width: "100%", alignItems: "center", gap: 8 }}>
        <Text style={styles.h4}>Não tem uma conta?</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/cadastro")}>
          <Text style={styles.buttonText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 48,
  },
  title: {
    flexDirection: "row",
  },
  subtitle: {
    flexDirection: "column",
    alignItems: "center",
  },
  h1: {
    fontSize: 64,
    fontWeight: "bold",
    lineHeight: 80,
  },
  h2: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
  },
  h4: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 24,
  },
  formWrapper: {
    width: "100%",
    marginTop: 20,
    marginBottom: 40
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
