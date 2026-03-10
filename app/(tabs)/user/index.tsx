import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../../lib/supabase";

export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState({
    full_name: "",
    avatar_url: "",
    monthly_income: 0,
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
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, monthly_income")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || "",
          monthly_income: data.monthly_income || 0,
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

    setLoading(true);
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
      setLoading(false);
      Alert.alert("Erro ao fazer o upload", uploadError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: filePath,
      })
      .eq("id", user.id);

    setLoading(false);
    if (updateError) {
      Alert.alert("Erro ao atualizar o perfil", updateError.message);
    } else {
      Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
      fetchProfile();
    }
  };

  const handleLogout = () => {
    const logoutAction = async () => {
      await supabase.auth.signOut();
      router.replace("/login");
    };

    if (Platform.OS === "web") {
      if (window.confirm("Tem certeza que deseja sair da conta?"))
        logoutAction();
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
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: newName,
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      Alert.alert("Erro ao atualizar o nome", error.message);
    } else {
      Alert.alert("Sucesso", "Nome atualizado com sucesso!");
      setShowInput(false);
      fetchProfile();
    }
  };

  const changeIncome = async () => {
    const incomeValue = parseFloat(newIncome.replace(",", "."));
    if (isNaN(incomeValue))
      return Alert.alert("Erro", "A renda deve ser um número válido.");

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        monthly_income: incomeValue,
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      Alert.alert("Erro ao atualizar renda", error.message);
    } else {
      Alert.alert("Sucesso", "Renda atualizada com sucesso!");
      setShowIncomeInput(false);
      fetchProfile();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
        },
      ]}
    >
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <TouchableOpacity onPress={changeProfilePic} disabled={loading}>
          {profile.avatar_url ? (
            <Image
              source={{
                uri: `https://fbyjoqkxfckiaegypykn.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}?t=${Date.now()}`,
              }}
              style={styles.avatar}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={120}
              color="#548ca8"
            />
          )}
        </TouchableOpacity>
        <Text style={styles.h4}>{profile.full_name || "Usuário"}</Text>
      </View>

      <View style={styles.rowItem}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons name="cash" size={20} color="#2979b0" />
          <Text style={styles.h4}>Renda Mensal</Text>
          <TouchableOpacity
            onPress={() => setShowIncomeInput(!showIncomeInput)}
          >
            <Ionicons
              name={showIncomeInput ? "chevron-up" : "chevron-down"}
              size={20}
              color="#2979b0"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.valueText}>
          R${" "}
          {Number(profile.monthly_income).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>

      {showIncomeInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newIncome}
            onChangeText={setNewIncome}
            keyboardType="decimal-pad"
            placeholder="Novo valor (ex: 3500.00)"
          />
          <TouchableOpacity
            style={styles.hiddenButton}
            onPress={changeIncome}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Salvar Renda</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.rowItem}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons
            name="pencil-outline"
            size={20}
            color="#2979b0"
          />
          <Text style={styles.h4}>Alterar nome</Text>
          <TouchableOpacity onPress={() => setShowInput(!showInput)}>
            <Ionicons
              name={showInput ? "chevron-up" : "chevron-down"}
              size={20}
              color="#2979b0"
            />
          </TouchableOpacity>
        </View>
      </View>

      {showInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Digite o novo nome"
          />
          <TouchableOpacity
            style={styles.hiddenButton}
            onPress={changeName}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Salvar Nome</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair da Conta</Text>
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
    paddingHorizontal: 30,
  },
  h4: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2979b0",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: "#2979b0",
    borderWidth: 4,
  },
  rowItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  inputContainer: {
    width: "100%",
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  hiddenButton: {
    height: 45,
    backgroundColor: "#2979b0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  logoutButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#ff4d4d",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
