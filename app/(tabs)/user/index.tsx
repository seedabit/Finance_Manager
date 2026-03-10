import { MaterialCommunityIcons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState({
    full_name: "",
    avatar_url: "",
    monthly_income: "",
  });
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showIncomeInput, setShowIncomeInput] = useState(false);
  const [newIncome, setNewIncome] = useState("");

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, monthly_income")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          monthly_income: data.monthly_income,
        });
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const changeProfilePic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (result.canceled) return;

    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return;

    const fileExtension = result.assets[0].uri.split(".").pop();
    const fileName = `${user.id}.${fileExtension}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(result.assets[0].base64!), {
        contentType: `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`,
        upsert: true,
      });

    if (uploadError) {
      Alert.alert("Erro ao fazer o upload", uploadError.message);
      return;
    }

    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name:
        profile.full_name || user.user_metadata.display_name || "Usuário",
      avatar_url: filePath,
    });

    if (updateError) {
      if (Platform.OS === "web") {
        alert("Erro ao atualizar o perfil: " + updateError.message);
      } else {
        Alert.alert("Erro ao atualizar o perfil", updateError.message);
      }
    } else {
      if (Platform.OS === "web") {
        alert("Sucesso! Foto de perfil atualizada com sucesso!");
      } else {
        Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
      }
      fetchProfile();
    }
  };

  const handleLogout = () => {
    const logoutAction = async () => {
      await supabase.auth.signOut();
      router.replace("/login");
    };

    if (Platform.OS === "web") {
      const confirmou = window.confirm("Tem certeza que deseja sair da conta?");
      if (confirmou) logoutAction();
    } else {
      Alert.alert("Sair", "Tem certeza que deseja sair da conta?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: logoutAction },
      ]);
    }
  };

  const changeName = async () => {
    if (!newName) return Alert.alert("Erro", "O nome não pode ser vazio.");

    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return;

    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: newName,
      avatar_url: profile.avatar_url,
      monthly_income: profile.monthly_income,
    });
    setLoading(false);

    if (error) {
      if (Platform.OS === "web") {
        alert("Erro ao atualizar o nome: " + error.message);
      } else {
        Alert.alert("Erro ao atualizar o nome", error.message);
      }
    } else {
      if (Platform.OS === "web") {
        alert("Sucesso! Nome atualizado com sucesso!");
      } else {
        Alert.alert("Sucesso", "Nome atualizado com sucesso!");
      }
      fetchProfile();
    }
  };

  const changeIncome = async () => {
    if (!newIncome) {
      if (Platform.OS === "web") {
        alert("Erro: A renda não pode ser vazia.");
      } else {
        Alert.alert("Erro", "A renda não pode ser vazia.");
      }
      return;
    }

    if (isNaN(parseFloat(newIncome))) {
      if (Platform.OS === "web") {
        alert("Erro: A renda deve ser um número válido.");
      } else {
        Alert.alert("Erro", "A renda deve ser um número válido.");
      }
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return;

    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      monthly_income: parseFloat(newIncome),
    });
    setLoading(false);

    if (error) {
      if (Platform.OS === "web") {
        alert("Erro ao atualizar a renda: " + error.message);
      } else {
        Alert.alert("Erro ao atualizar renda", error.message);
      }
    } else {
      if (Platform.OS === "web") {
        alert("Sucesso! Renda atualizada com sucesso!");
      } else {
        Alert.alert("Sucesso", "Renda atualizada com sucesso!");
      }
      fetchProfile();
    }
  };

  return (
    <ScrollView
      style={ styles.container }
      contentContainerStyle={[
        styles.scrollContent,
        { 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40
        },
      ]}
    >
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={changeProfilePic}>
          {profile.avatar_url ? (
            <Image
              source={{
                uri: `https://fbyjoqkxfckiaegypykn.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}?${Date.now()}`,
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderColor: "#1a5b8c",
                borderWidth: 4,
              }}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={120}
              color="#000"
            />
          )}
        </TouchableOpacity>
        <Text style={styles.h4}>{profile.full_name}</Text>
      </View>

      <View style={styles.rowItem}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={styles.h4}>Renda Mensal</Text>
          <TouchableOpacity
            onPress={() => setShowIncomeInput(!showIncomeInput)}
          >
            <Ionicons
              name={showIncomeInput ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        <Text>
          R${" "}
          {profile.monthly_income
            ? Number(profile.monthly_income).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "0,00"}
        </Text>
      </View>

      {showIncomeInput && (
        <View style={styles.inputContainer}>
          <Text style={styles.text}>
            Para alterar sua renda, digite o novo valor no campo abaixo e clique
            em "Alterar Renda".
          </Text>
          <TextInput
            style={styles.input}
            value={newIncome}
            onChangeText={setNewIncome}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
          <TouchableOpacity
            style={styles.hiddenButton}
            onPress={changeIncome}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Alterar Renda</Text>
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          marginBottom: 10,
          gap: 5,
        }}
      >
        <Text style={styles.h4}>Alterar nome</Text>
        <TouchableOpacity
          onPress={() => {
            setShowInput(!showInput);
          }}
        >
          <Ionicons
            name={showInput ? "chevron-up" : "chevron-down"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {showInput && (
        <View style={styles.inputContainer}>
          <Text style={styles.text}>
            Para alterar seu nome, digite o novo nome no campo abaixo e clique
            em "Alterar Nome".
          </Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
          />
          <TouchableOpacity
            style={[styles.hiddenButton, { marginHorizontal: 30 }]}
            onPress={changeName}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Alterar Nome</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 12,
    textAlign: "justify",
    paddingHorizontal: 10,
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
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#2374AB",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  hiddenButton: {
    height: 40,
    backgroundColor: "#2374AB",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  arrowButton: {
    width: 25,
    height: 25,
    backgroundColor: "#2374AB",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#D9D9D9",
    borderRadius: 32,
    paddingHorizontal: 20,
    opacity: 0.5,
  },
  rowItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    gap: 15,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
